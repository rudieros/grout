import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { Inject, Service } from 'typedi'
import { UserDataSource } from '../data-sources/UserDataSource'
import { User } from '../../../_common/models/User'

@Service()
export class GetUsersByIDsUC extends BaseUseCase<
  string[] | string,
  User | User[]
> {
  @Inject(UserDataSource)
  userDataBase: UserDataSource

  async execute(input: string[] | string): Promise<User[] | User> {
    if (input instanceof Array) {
      return this.userDataBase.getUsers(input)
    }
    const users = await this.userDataBase.getUsers([input])
    return users[0]
  }
}
