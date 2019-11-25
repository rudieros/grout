import { UserDataSource } from '../core/data-sources/UserDataSource'
import { User } from '../../_common/models/User'
import { UserDB, UserEntity } from '../../_common/database/entities/userEntity'
import * as DataLoader from 'dataloader'
import { MainTableDB } from '../../_common/database/mainTableBaseSchema'
import { generateThumbnails } from '../../_common/services/imageTranscoder/generateThumbnails'
import { Config } from '../../config'
import { ThumbnailSize } from '../../_common/services/imageTranscoder/models/thumbnailSize'
import { DbEntities } from '../../_common/database/entities/_dbEntities'
import { LocationDB } from '../../_common/database/entities/userLocationEntity'
import { buildDataLoader } from '../../_common/utils/buildDataLoader'

export class UserDynamoDataBase implements UserDataSource {
  static getSortPlaceholder = () => 'user'

  static mapAppIdToDBKey(id: string) {
    return { id, sort: UserDynamoDataBase.getSortPlaceholder() }
  }

  static mapFromDb(
    input: UserDB
  ): Omit<User, 'location' | 'currentSubscriptionPlan'> {
    return {
      ...input,
      id: input.sort,
    } as any
  }
  // use Data Loader for batch caching!
  userDataLoader: DataLoader<MainTableDB, UserDB> = buildDataLoader(UserEntity)
  locationDataLoader: DataLoader<MainTableDB, LocationDB> = buildDataLoader(
    UserEntity
  )

  async getUsers(ids: string[]): Promise<User[]> {
    try {
      const users = await this.userDataLoader.loadMany(
        ids.map(UserDynamoDataBase.mapAppIdToDBKey)
      )
      return users.map(UserDynamoDataBase.mapFromDb as any)
    } catch (e) {
      console.log('Erro', e)
      throw e
    }
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userDataLoader.load({
      id: DbEntities.User,
      sort: id,
    })
    return UserDynamoDataBase.mapFromDb(user) as any
  }

  async createUser(input: User): Promise<User> {
    const user = {
      id: DbEntities.User,
      sort: input.id,
      email: input.email,
      name: input.name,
      userName: input.name,
      profilePicture:
        input.profilePicture &&
        input.profilePicture.original &&
        input.profilePicture,
      gender: input.gender,
      dateOfBirth: input.dateOfBirth,
    }
    await UserEntity.create(user as any)
    return user as any
  }

  async updateUser(id: string, data: Partial<User>) {
    return UserEntity.update(
      {
        id,
        sort: UserDynamoDataBase.getSortPlaceholder(),
      },
      data as any
    )
  }

  async generateProfilePictureThumbs(object: UserDB) {
    if (object.profilePicture && object.profilePicture.original) {
      const { original, thumbnailUrls } = await generateThumbnails(
        object.profilePicture.original,
        object.profilePicture.original.replace(
          Config.StorageBucketDirectory,
          Config.StorageBucketTranscodedMediaDirectory
        )
      )
      return UserEntity.update(object, {
        profilePicture: {
          original,
          small: thumbnailUrls[ThumbnailSize.small],
          medium: thumbnailUrls[ThumbnailSize.medium],
        },
      })
    }
  }
}
