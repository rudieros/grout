import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { Inject, Service } from 'typedi'
import { UserDataSource } from '../data-sources/UserDataSource'
import {
  CheckUsernameAvailableInputs,
  CheckUsernameAvailableResult,
} from '../../presentation/models/CheckUsernameAvailableInputs'
import { AuthDynamoDataBase } from '../../data/AuthDynamoDataBase'

@Service()
export class CheckUsernameAvailableUC extends BaseUseCase<
  CheckUsernameAvailableInputs,
  CheckUsernameAvailableResult
> {
  @Inject(UserDataSource)
  userDataBase: UserDataSource

  async execute(
    input: CheckUsernameAvailableInputs
  ): Promise<CheckUsernameAvailableResult> {
    const authDataBase = new AuthDynamoDataBase() // TODO inject this dependency somehow
    let isEmailAvailablePromise = Promise.resolve(undefined as
      | boolean
      | undefined)
    let isUsernameAvailablePromise = Promise.resolve(undefined as
      | boolean
      | undefined)
    if (input.email) {
      isEmailAvailablePromise = authDataBase.checkEmailAvailable(input.email)
    }
    if (input.userName) {
      isUsernameAvailablePromise = authDataBase.checkUsernameAvailable(
        input.userName
      )
    }
    return {
      emailAvailable: await isEmailAvailablePromise,
      userNameAvailable: await isUsernameAvailablePromise,
    }
  }
}
