import { Arg, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { SignUpInput } from './models/SignUpInput'
import { SignUpUC } from '../core/use-cases/SignUpUC'
import { Response, successResponse } from '../../_common/graphql/commonTypes/Response'
import { UserRoles } from '../../_common/authorization/UserRoles'
import { GetUsersByIDsUC } from '../core/use-cases/GetUsersByIDsUC'
import { OSContext } from '../../context'
import { Inject, Service } from 'typedi'
import { CheckUsernameAvailableInputs, CheckUsernameAvailableResult } from './models/CheckUsernameAvailableInputs'
import { CheckUsernameAvailableUC } from '../core/use-cases/CheckUsernameAvailableUC'
import { SignInUC } from '../core/use-cases/SignInUC'
import { SignInInput } from './models/SignInInput'
import { PasswordRecoveryInput } from './models/PasswordRecoveryInput'
import { PasswordRecoveryUC } from '../core/use-cases/PasswordRecoveryUC'
import { ChangePasswordInput } from './models/ChangePasswordInput'
import { ChangePasswordUC } from '../core/use-cases/ChangePasswordUC'
import { Picture } from '../../_common/models/Picture'
import { FacebookSignInResponse } from './models/FacebookSignInResponse'
import { FacebookSignInInput } from './models/FacebookSignInInput'
import { FacebookSignInUC } from '../core/use-cases/FacebookSignInUC'
import { PictureUC } from '../../_common/core/use-cases/PictureUC'
import { EmailVerifiedUC } from '../core/use-cases/EmailVerifiedUC'
import { GetUserLocationUC } from '../core/use-cases/GetUserLocationUC'
import { User } from '../../_common/models/User'

@Resolver(User)
@Service()
export class UserResolver {
  @Inject(OSContext)
  context: OSContext

  @Authorized(UserRoles.user)
  @Query((returns) => User)
  async user(@Arg('userId') userId: string) {
    const useCase = this.context.container.get(GetUsersByIDsUC)
    return useCase.execute(userId)
  }

  @Authorized(UserRoles.user)
  @Query((returns) => User)
  async me() {
    const useCase = this.context.container.get(GetUsersByIDsUC)
    return useCase.execute(this.context.uid)
  }

  @Mutation((returns) => User)
  async signIn(@Arg('signInInput') input: SignInInput): Promise<User> {
    const useCase = this.context.container.get(SignInUC)
    return useCase.execute(input)
  }

  @Mutation((returns) => FacebookSignInResponse)
  async facebookSignIn(@Arg('input') input: FacebookSignInInput) {
    const uc = this.context.container.get(FacebookSignInUC)
    return uc.execute(input)
  }

  @Mutation((returns) => User)
  async signUp(@Arg('user') input: SignUpInput) {
    const useCase = this.context.container.get(SignUpUC)
    return useCase.execute(input)
  }

  @Query((returns) => CheckUsernameAvailableResult)
  async checkUserAvailable(@Arg('input') input: CheckUsernameAvailableInputs) {
    const useCase = this.context.container.get(CheckUsernameAvailableUC)
    return useCase.execute(input)
  }

  @Mutation((returns) => Response)
  async passwordRecovery(@Arg('input') input: PasswordRecoveryInput) {
    const useCase = this.context.container.get(PasswordRecoveryUC)
    return useCase.execute(input)
  }

  @Authorized(UserRoles.user)
  @Mutation((returns) => Response)
  async changePassword(@Arg('changePasswordInput') input: ChangePasswordInput) {
    const useCase = this.context.container.get(ChangePasswordUC)
    return useCase.execute(input).then(successResponse)
  }

  @FieldResolver()
  profilePicture(@Root() root: User): Promise<Picture> {
    const useCase = this.context.container.get(PictureUC)
    return useCase.execute(root.profilePicture)
  }

  @FieldResolver(() => Boolean)
  emailVerified(@Root() root: User): Promise<Boolean> {
    const useCase = this.context.container.get(EmailVerifiedUC)
    return useCase.execute(root.id)
  }

  @FieldResolver(() => Location)
  location(@Root() root: User): Promise<Location> {
    const useCase = this.context.container.get(GetUserLocationUC)
    return useCase.execute(root.id)
  }
}
