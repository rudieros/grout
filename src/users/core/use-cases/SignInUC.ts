import { Inject, Service } from 'typedi'
import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { UserDataSource } from '../data-sources/UserDataSource'
import { OSContext } from '../../../context'
import { SignInInput } from '../../presentation/models/SignInInput'
import {
  EncryptionManagerService,
  SignInUC as LogUserUC,
  TokenGeneratorService,
} from '@appsimples/os-heimdall/build/src'
import { AuthDynamoDataBase } from '../../data/AuthDynamoDataBase'
import { UserRoles } from '../../../_common/authorization/UserRoles'
import { ErrorCodes } from '../../../errorCodes'
import { ApolloError } from 'apollo-server-lambda'
import { User } from '../../../_common/models/User'

@Service()
export class SignInUC extends BaseUseCase<SignInInput, User> {
  @Inject(UserDataSource)
  userDataBase: UserDataSource

  @Inject(OSContext)
  context: OSContext

  async execute(input: SignInInput): Promise<User> {
    const authDb = new AuthDynamoDataBase()
    const useCase = new LogUserUC(
      authDb,
      new TokenGeneratorService(),
      new EncryptionManagerService(),
      'outsmartHash' // TODO put jwk!
    )
    const result = await useCase
      .execute({
        authIdentifier: input.authId,
        password: input.password,
        userRole: UserRoles.user,
      })
      .catch((e) => {
        if (!(e instanceof ApolloError)) {
          throw new ApolloError(
            'Invalid email, userName or password',
            ErrorCodes.USER_NOT_FOUND
          )
        } else {
          throw e
        }
      })
    this.context.container.set('token', result.token)
    this.context.container.set('uid', result.userId)
    return this.userDataBase.getUser(result.userId)
  }
}
