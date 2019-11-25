import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { AuthDynamoDataBase } from '../../data/AuthDynamoDataBase'
import { AuthEntity } from '../../../_common/database/entities/AuthEntity'
import { DbEntities } from '../../../_common/database/entities/_dbEntities'

export class ConfirmEmailUC extends BaseUseCase<
  { userId: string; code: any },
  boolean
> {
  async execute(input: { userId: string; code: any }): Promise<boolean> {
    const authDB = new AuthDynamoDataBase()
    const item = await authDB.getByUserId(input.userId)
    const match = item.emailConfirmationCode === input.code
    if (match) {
      await AuthEntity.update(
        { id: DbEntities.Auth, sort: input.userId },
        {
          emailVerified: true,
        }
      )
    }
    return match
  }
}
