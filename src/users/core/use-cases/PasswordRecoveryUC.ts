import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { Inject, Service } from 'typedi'
import { UserDataSource } from '../data-sources/UserDataSource'
import { PasswordRecoveryInput } from '../../presentation/models/PasswordRecoveryInput'
import { Response } from '../../../_common/graphql/commonTypes/Response'
import { AuthDynamoDataBase } from '../../data/AuthDynamoDataBase'
import {
  EncryptionManagerService,
  HeimdallError,
  RecoverPasswordResult,
  RecoverPasswordUC,
} from '@appsimples/os-heimdall/build/src'
import { EmailService } from '../../../_common/services/emailService'
import { UserRoles } from '../../../_common/authorization/UserRoles'
import { ApolloError } from 'apollo-server-lambda'
import { ErrorCodes } from '../../../errorCodes'
import { OSContext } from '../../../context'
import { RecoveryCodeGenerator } from '../../../_common/services/recoveryCodeGenerator'
import { SignInUC } from './SignInUC'

@Service()
export class PasswordRecoveryUC extends BaseUseCase<
  PasswordRecoveryInput,
  Response
> {
  @Inject(OSContext)
  context: OSContext

  @Inject(UserDataSource)
  userDataBase: UserDataSource

  @Inject(EmailService)
  emailService: EmailService

  async execute(input: PasswordRecoveryInput): Promise<Response> {
    const recoverPasswordUseCase = new RecoverPasswordUC({
      authDataSource: new AuthDynamoDataBase(),
      encryptionManager: new EncryptionManagerService(),
      authEncryptionHash: 'outsmartHash', // TODO implement hash
      recoveryCodeGenerator: this.context.container.get(RecoveryCodeGenerator),
      emailSender: async (authItem, recoveryCode) => {
        await this.emailService.sendEmail({
          to: authItem.authId,
          message: `Your recovery code is ${recoveryCode}`,
          subject: `Together - Password Reset`, // TODO extract these strings maybe? I18n, sure
        })
      },
    })
    try {
      const result = await recoverPasswordUseCase.execute({
        code: input.code,
        userRole: UserRoles.user,
        authId: input.email,
        newPassword: input.newPassword,
      })
      if (result === RecoverPasswordResult.PASSWORD_CHANGED) {
        await this.signIn(input)
      }
    } catch (e) {
      if (e instanceof HeimdallError) {
        const code = (e as any).code
        throw new ApolloError(`Error recovering password: ${e}`, code)
      } else {
        throw new ApolloError(`Unknown error! ${e}`, ErrorCodes.UNKNOWN_ERROR)
      }
    }
    return { message: 'Success' }
  }

  async signIn(input: PasswordRecoveryInput) {
    const signInUC = this.context.container.get(SignInUC)
    await signInUC.execute({
      authId: input.email,
      password: input.newPassword,
    })
  }
}
