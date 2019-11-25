import { Inject, Service } from 'typedi'
import {
  StreamHandler,
  StreamHandlerInput,
} from '../../../_common/database/streams/StreamHandler'
import { UserDataSource } from '../../core/data-sources/UserDataSource'
import { UserDB } from '../../../_common/database/entities/userEntity'
import { UserDynamoDataBase } from '../UserDynamoDataBase'

@Service()
export class UserStreamHandler extends StreamHandler<UserDB> {
  @Inject(UserDataSource)
  userDataSource: UserDynamoDataBase

  async handleStream(inputs: StreamHandlerInput<UserDB>[]) {
    await this.generateThumbs(inputs)
  }

  async generateThumbs(input: StreamHandlerInput<UserDB>[]): Promise<any> {
    return Promise.all(
      input.map(async ({ document, event }) => {
        if (event === 'INSERT') {
          return this.userDataSource.generateProfilePictureThumbs(document)
        }
        return Promise.resolve()
      })
    )
  }
}
