import { Inject, Service } from 'typedi'
import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { UserDataSource } from '../data-sources/UserDataSource'
import { OSContext } from '../../../context'
import { UserRoles } from '../../../_common/authorization/UserRoles'
import { ApolloError } from 'apollo-server-lambda'
import { FacebookAuth } from '@appsimples/os-heimdall'
import { FacebookSignInInput } from '../../presentation/models/FacebookSignInInput'
import { Config } from '../../../config'
import { AuthDynamoDataBase } from '../../data/AuthDynamoDataBase'
import {
  FacebookAuthResponse,
  FacebookAuthStatus,
  HeimdallError,
} from '@appsimples/os-heimdall/build/src'
import { FacebookSignInResponse } from '../../presentation/models/FacebookSignInResponse'
import { ErrorCodes } from '../../../errorCodes'
import { Auth } from '../../../_common/models/Auth'
import { FacebookUser } from '../../../_common/models/FacebookUser'

@Service()
export class FacebookSignInUC extends BaseUseCase<
  FacebookSignInInput,
  FacebookSignInResponse
> {
  @Inject(UserDataSource)
  userDataBase: UserDataSource

  @Inject(OSContext)
  context: OSContext

  authDatabase: AuthDynamoDataBase = new AuthDynamoDataBase()

  async execute(input: FacebookSignInInput): Promise<FacebookSignInResponse> {
    this.authDatabase.facebookOverrideEmail = input.signUp && input.signUp.email
    const useCase = new FacebookAuth<Auth, FacebookUser>({
      clientId: Config.FacebookAppId,
      clientSecret: Config.FacebookAppSecret,
      authDataSource: this.authDatabase,
      userRole: UserRoles.user,
      tokenHash: 'outsmartHash', // TODO use jwk!
    })
    const result = await useCase
      .signIn({
        token: input.facebookToken,
        forceSignUp: !!input.signUp,
      })
      .catch((e) => {
        if (e instanceof HeimdallError) {
          throw new ApolloError(e.message, e.code)
        }
        throw new ApolloError(e.message, ErrorCodes.UNKNOWN_ERROR)
      })

    // tslint:disable-next-line:prefer-switch
    if (result.status === FacebookAuthStatus.SIGN_UP_NEEDED) {
      return this.handleSignUpNeeded(input, result)
    } else if (result.status === FacebookAuthStatus.SIGN_UP_COMPLETED) {
      return this.handleSignUpCompleted(input, result)
    } else if (result.status === FacebookAuthStatus.SIGN_IN) {
      return this.handleSignIn(input, result)
    } else {
      throw new ApolloError(
        'Unexpected FacebookAuth response',
        ErrorCodes.UNKNOWN_ERROR
      )
    }
  }

  async handleSignUpNeeded(
    input: FacebookSignInInput,
    result: FacebookAuthResponse<Auth, FacebookUser, UserRoles>
  ) {
    let emailAvailable = true
    if (result.facebookUser && result.facebookUser.email) {
      emailAvailable = await this.authDatabase.checkEmailAvailable(
        result.facebookUser.email
      )
    }
    return {
      status: result.status,
      message: 'Success',
      facebookUser: {
        name: result.facebookUser.name,
        email: result.facebookUser.email,
        profilePicture: (result.facebookUser as any).picture.data.url,
        emailAvailable,
      },
    }
  }

  async handleSignUpCompleted(
    input: FacebookSignInInput,
    result: FacebookAuthResponse<Auth, FacebookUser, UserRoles>
  ) {
    if (result.status !== FacebookAuthStatus.SIGN_UP_COMPLETED) {
      // this is necessary for correct type inferring
      throw new ApolloError('Unknown error', ErrorCodes.UNKNOWN_ERROR)
    }
    await this.userDataBase.createUser({
      id: result.authItem.id,
      ...input.signUp,
    } as any)
    this.context.container.set('token', result.token)
    this.context.container.set('uid', result.authItem.id)
    return {
      status: result.status,
      message: 'Success',
      facebookUser: {
        name: result.facebookUser.name,
        email: result.facebookUser.email,
        profilePicture: (result.facebookUser as any).picture.data.url,
      },
    }
  }

  async handleSignIn(
    input: FacebookSignInInput,
    result: FacebookAuthResponse<Auth, FacebookUser, UserRoles>
  ) {
    if (result.status !== FacebookAuthStatus.SIGN_IN) {
      // this is necessary for correct type inferring
      throw new ApolloError('Unknown error', ErrorCodes.UNKNOWN_ERROR)
    }
    this.context.container.set('token', result.token)
    this.context.container.set('uid', result.authItem.id)
    return {
      status: result.status,
      message: 'Success',
    }
  }
}
