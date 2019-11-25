import 'source-map-support/register'
import 'reflect-metadata'
import { ImageTranscoder } from './imageTranscoderHandler'
import { Config } from '../../../config'
import { UserDynamoDataBase } from '../../../users/data/UserDynamoDataBase'

console.log('Config', Config.StorageBucketDirectory)
enum ThumbnailTypes {
  small = 'small',
  medium = 'medium',
}

export const handler = ImageTranscoder({
  bucketName: Config.StorageBucketName,
  foldersToWatch: [
    `${Config.StorageBucketDirectory}/${Config.StorageBucketUserDirectory}`,
    `${Config.StorageBucketDirectory}/${Config.StorageBucketGroupsDirectory}`,
    `${Config.StorageBucketDirectory}/${Config.StorageBucketPostsDirectory}`,
  ],
  thumbnailOptions: [
    {
      width: 64,
      height: 64,
      resizeOption: '>',
      thumbnailSuffixName: 'small',
      id: ThumbnailTypes.small,
    },
    {
      width: 128,
      height: 128,
      resizeOption: '>',
      thumbnailSuffixName: 'medium',
      id: ThumbnailTypes.medium,
    },
  ],
  // handleOriginal: async (originalUrl) => {
  // },
  callback: async (originalUrl: string, generatedUrls) => {
    const [
      storageFolder,
      entityFolder,
      userId,
      ...otherEntityIds
    ] = originalUrl.split('/')
    if (entityFolder === Config.StorageBucketUserDirectory) {
      console.log(
        'IMAGE TRANSCODER: UPDATING PROFILE IMAGE URL: ',
        generatedUrls
      )
      const database = new UserDynamoDataBase()
      await database.updateUser(userId, {
        profilePicture: {
          original: originalUrl,
          small: generatedUrls[ThumbnailTypes.small],
          medium: generatedUrls[ThumbnailTypes.medium],
        },
      })
    }
  },
})
