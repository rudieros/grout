import { User } from '../../../_common/models/User'
import { Token } from 'typedi'

export const UserDataSource = new Token<UserDataSource>()

export interface UserDataSource {
  getUsers(ids: string[]): Promise<User[]>
  getUser(id: string): Promise<User>
  createUser(input: User): Promise<User>
}
