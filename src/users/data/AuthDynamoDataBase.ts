import {
  CredentialProvider,
  OSAuthDataSource,
  SecureAuthInfo,
  SecureAuthInfoRequest,
} from '@appsimples/os-heimdall/build/src'
import { AuthDB, AuthEntity } from '../../_common/database/entities/AuthEntity'
import { generateId } from '../../_common/utils/generateId'
import { Auth } from '../../_common/models/Auth'
import { ApolloError } from 'apollo-server-lambda'
import { ErrorCodes } from '../../errorCodes'
import { FacebookUser } from '../../_common/models/FacebookUser'
import { UserRoles } from '../../_common/authorization/UserRoles'
import { DbEntities } from '../../_common/database/entities/_dbEntities'
import { MainTableDB } from '../../_common/database/mainTableBaseSchema'
import { UserDB, UserEntity } from '../../_common/database/entities/userEntity'
import { dedupeDynamoKeys } from '../../_common/utils/dedupeDynamoKeys'
import * as DataLoader from 'dataloader'
import { generateRandomCode } from '../../_common/utils/generateRandomCode'
import { buildDataLoader } from '../../_common/utils/buildDataLoader'

const index1Placeholder = 'uniqueUsername'
const index2Placeholder = 'uniqueEmail'

export class AuthDynamoDataBase
  implements OSAuthDataSource<Auth, FacebookUser> {
  static getPartition1PlaceHolder = () => 'uniqueUsername'
  static getPartition2PlaceHolder = () => 'facebookId'
  static getSortPlaceHolder = () => 'uniqueEmail'
  public facebookOverrideEmail: string
  private emailConfirmationCode: any

  authDataLoader: DataLoader<MainTableDB, AuthDB> = buildDataLoader(AuthEntity)

  public setEmailConfirmationCode(value: any) {
    this.emailConfirmationCode = value
  }

  async getByUserId(userId: string): Promise<Auth> {
    const result = await this.authDataLoader.load({
      id: DbEntities.Auth,
      sort: userId,
    })
    return this.mapDBToModel(result)
  }

  constructor(private userName?: string) {}

  mapKey(id: string) {
    return { id, sort: AuthDynamoDataBase.getSortPlaceHolder() }
  }

  mapDBToModel(input: AuthDB): Auth {
    return {
      id: input.sort,
      authId: input.id,
      encryptedPassword: input.password,
      provider: input.provider,
      userRole: input.userRole,
      userName: input.querySort1,
      passwordRecoveryCode: input.passwordRecoveryCode,
      emailVerified: input.emailVerified,
      emailConfirmationCode: input.emailConfirmationCode,
    }
  }

  async createAuthItem(input: SecureAuthInfoRequest): Promise<Auth> {
    const [existingUsername, existingEmail] = await Promise.all([
      AuthEntity.query({
        queryPartition1: index1Placeholder,
      })
        .where('querySort1')
        .eq(this.userName)
        .exec(),
      AuthEntity.query({
        queryPartition2: index2Placeholder,
      })
        .where('querySort2')
        .eq(input.authId)
        .exec(),
    ])
    const alreadyExistsError = new ApolloError(
      'User with this username or email already exists',
      ErrorCodes.USER_ALREADY_EXISTS
    )
    if (existingUsername.length || existingEmail.length) {
      throw alreadyExistsError
    }
    const userId = generateId()
    try {
      if (!this.emailConfirmationCode) {
        throw new ApolloError(
          'Provide emailConfirmationCode!',
          ErrorCodes.IMPLEMENTATION_ERROR
        )
      }
      const auth = await AuthEntity.create({
        id: DbEntities.Auth,
        sort: userId,
        password: input.encryptedPassword,
        provider: input.provider,
        userRole: input.userRole,
        queryPartition1: index1Placeholder,
        querySort1: this.userName,
        queryPartition2: index2Placeholder,
        querySort2: input.authId, // authId is email
        emailVerified: false, // todo put in flag
        emailConfirmationCode: this.emailConfirmationCode,
      })
      return {
        ...auth,
        id: userId,
        userName: auth.querySort1,
        encryptedPassword: auth.password,
        authId: input.authId,
      }
    } catch (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        throw alreadyExistsError
      }
      throw err
    }
  }

  async getAuthItem(authId: string): Promise<Auth | undefined> {
    const isEmail = authId.includes('@')
    let authUser: any
    if (isEmail) {
      authUser = await AuthEntity.query({
        queryPartition2: index2Placeholder,
      })
        .where('querySort2')
        .eq(authId)
        .exec()
    } else {
      authUser = await AuthEntity.query({
        queryPartition1: index1Placeholder,
      })
        .where('querySort1')
        .eq(authId)
        .exec()
    }
    if (!authUser || !authUser.length) {
      const userNotFoundError = new ApolloError(
        'User with this username or email does not exists',
        ErrorCodes.USER_NOT_FOUND
      )
      throw userNotFoundError
    }
    // if (!authUser[0].emailVerified) {
    //   throw new ApolloError(
    //     'Email needs to be verified',
    //     ErrorCodes.EMAIL_NOT_VERIFIED
    //   )
    // }
    return this.mapDBToModel(authUser[0])
  }

  async updateAuthItem(
    secureAuthInfoToUpdate: SecureAuthInfo
  ): Promise<Auth | undefined> {
    const key = {
      id: secureAuthInfoToUpdate.authId,
      userRole: secureAuthInfoToUpdate.userRole,
    }
    const updatedAuth = await AuthEntity.update(
      this.mapKey(secureAuthInfoToUpdate.authId),
      {
        ...secureAuthInfoToUpdate,
      }
    )
    return this.mapDBToModel(updatedAuth)
  }

  async checkUsernameAvailable(userName: string) {
    const result = await AuthEntity.query({
      queryPartition1: AuthDynamoDataBase.getPartition1PlaceHolder(),
    })
      .where('querySort1')
      .eq(userName)
      .exec()
    return !result.length
  }

  async checkEmailAvailable(email: string) {
    const result = await AuthEntity.get(this.mapKey(email))
    return !result
  }

  async createFacebookAuthItem(
    fbUser: FacebookUser,
    token: string
  ): Promise<Auth> {
    throw new Error('Not implemented')
  }

  async fetchFacebookAuthItem(input: {
    token: string
    fbId: string
  }): Promise<Auth | undefined> {
    const existingFacebookUser = await AuthEntity.query({
      queryPartition2: AuthDynamoDataBase.getPartition2PlaceHolder(),
    })
      .where('querySort2')
      .eq(input.fbId)
      .exec()
    return (
      existingFacebookUser &&
      existingFacebookUser[0] &&
      this.mapDBToModel(existingFacebookUser[0])
    )
  }
}
