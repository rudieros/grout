import { Inject, Service } from 'typedi'
import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { ChangePasswordInput } from '../../presentation/models/ChangePasswordInput'
import { UserDataSource } from '../data-sources/UserDataSource'
import { OSContext } from '../../../context'
import {
  EncryptionManagerService,
  ChangePasswordUC as AuthChangePasswordUC,
} from '@appsimples/os-heimdall/build/src'
import { AuthDynamoDataBase } from '../../data/AuthDynamoDataBase'
import { UserRoles } from '../../../_common/authorization/UserRoles'
import { ErrorCodes } from '../../../errorCodes'
import { ApolloError } from 'apollo-server-lambda'

@Service()
export class ChangePasswordUC extends BaseUseCase<ChangePasswordInput, void> {
  @Inject(UserDataSource)
  userDataBase: UserDataSource
  @Inject(OSContext)
  context: OSContext

  async execute(input: ChangePasswordInput): Promise<void> {
    const useCase = new AuthChangePasswordUC(
      new AuthDynamoDataBase(),
      new EncryptionManagerService(),
      'outsmartHash' // TODO put jwk!
    )
    const user = await this.userDataBase.getUser(this.context.uid)
    await useCase
      .execute({
        authIdentifier: user.email,
        oldPassword: input.password,
        newPassword: input.newPassword,
        userRole: UserRoles.user,
      })
      .catch((e) => {
        throw new ApolloError('Invalid password', ErrorCodes.INVALID_PASSWORD)
      })
  }
}
