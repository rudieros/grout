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
export class EmailVerifiedUC extends BaseUseCase<string, boolean> {
  @Inject(OSContext)
  context: OSContext

  async execute(userId: string): Promise<boolean> {
    const authDB = new AuthDynamoDataBase()
    const item = await authDB.getByUserId(userId)
    return item.emailVerified
  }
}
