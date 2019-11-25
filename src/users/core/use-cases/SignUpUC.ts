import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import {
  CredentialProvider,
  EncryptionManagerService,
  SignUpUC as RegisterUserUC,
  TokenGeneratorService,
} from '@appsimples/os-heimdall/build/src'
import { UserRoles } from '../../../_common/authorization/UserRoles'
import { SignUpInput } from '../../presentation/models/SignUpInput'
import { Inject, Service } from 'typedi'
import { UserDataSource } from '../data-sources/UserDataSource'
import { AuthDynamoDataBase } from '../../data/AuthDynamoDataBase'
import { OSContext } from '../../../context'
import { generateId } from '../../../_common/utils/generateId'
import { EmailService } from '../../../_common/services/emailService'
import { Config } from '../../../config'
import { generateRandomCode } from '../../../_common/utils/generateRandomCode'
import { User } from '../../../_common/models/User'

const mapInput = (userId: string, input: SignUpInput) => {
  return {
    id: userId,
    name: input.name,
    userName: input.userName,
    email: input.email,
    dateOfBirth: input.dateOfBirth && new Date(input.dateOfBirth),
    gender: input.gender,
    location: {
      id: generateId(),
      lat: input.lat,
      lon: input.lon,
      nickName: input.locationNickname,
    },
    profilePicture: { original: input.profilePicturePath },
    emailVerified: false,
    currentSubscriptionPlan: {
      id: generateId(),
      expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      subscriptionDate: new Date(),
      userId,
    },
  } as any
}

@Service()
export class SignUpUC extends BaseUseCase<SignUpInput, User> {
  @Inject(EmailService)
  email: EmailService

  @Inject(UserDataSource)
  userDataBase: UserDataSource

  @Inject(OSContext)
  context: OSContext

  async execute(input: SignUpInput): Promise<User> {
    const authDb = new AuthDynamoDataBase(input.userName)
    const emailConfirmationCode = generateRandomCode(6)()
    authDb.setEmailConfirmationCode(emailConfirmationCode)
    const useCase = new RegisterUserUC(
      authDb,
      new TokenGeneratorService(),
      new EncryptionManagerService(),
      'outsmartHash' // TODO put jwk!
    )
    const result = await useCase.execute({
      userRole: UserRoles.user,
      authIdentifier: input.email,
      password: input.password,
      credentialProvider: CredentialProvider.internal,
    })
    const createdUser = await this.userDataBase.createUser(
      mapInput(result.userId, input)
    )
    this.context.container.set('token', result.token)
    this.context.container.set('uid', result.userId)
    await this.email.sendEmail({
      to: input.email,
      message: `${Config.EmailConfirmBaseUrl}?i=${result.userId}&c=${emailConfirmationCode}`,
      subject: 'Confirmação de Cadastro',
    })
    return createdUser
  }
}
