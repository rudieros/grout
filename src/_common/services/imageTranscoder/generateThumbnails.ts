import { ConfigValidator } from './configValidator'
import { GmImageMagicManager } from './gmImageMagicManager'
import { ImageTranscoderConfig } from './models/imageTranscoderConfig'
import { S3Manager } from './s3Manager'
import { Config } from '../../../config'

enum ThumbnailTypes {
  small = 'small',
  medium = 'medium',
}

const config: ImageTranscoderConfig = {
  bucketName: Config.StorageBucketName,
  thumbnailOptions: [
    {
      width: 64,
      height: 64,
      resizeOption: '>',
      thumbnailSuffixName: 'small',
      id: ThumbnailTypes.small,
    },
    {
      width: 256,
      height: 256,
      resizeOption: '>',
      thumbnailSuffixName: 'medium',
      id: ThumbnailTypes.medium,
    },
  ],
}

export const generateThumbnails = async (
  imagePath: string,
  destinationPath?: string
) => {
  try {
    const srcBucketName = config.bucketName
    const srcBucketKey = imagePath

    const configValidator = new ConfigValidator(config)
    const s3Manager = new S3Manager(srcBucketName)
    const gmImageMagicManager = new GmImageMagicManager()
    const validatedConfig = await configValidator.validate(
      srcBucketName,
      srcBucketKey
    )
    const originalImageData = await s3Manager.dowloadImage(srcBucketKey)
    const imageType = await gmImageMagicManager.identifyImageFormat(
      validatedConfig.imageFormats,
      originalImageData.Body as Buffer
    )
    const thumbnailUrls: { [id: string]: string } = {}
    for (const thumbnailOption of validatedConfig.thumbnailOptions) {
      const resizedImage = await gmImageMagicManager.resizeImage(
        thumbnailOption as any,
        srcBucketKey,
        originalImageData.Body as Buffer,
        imageType
      )
      const newKey = generateImageNewKey(
        destinationPath || srcBucketKey,
        thumbnailOption.thumbnailSuffixName
      )
      thumbnailUrls[thumbnailOption.id] = newKey
      await s3Manager.upload(newKey, resizedImage, imageType)
    }
    return { original: srcBucketKey, thumbnailUrls }
  } catch (err) {
    console.log('GENERATE THUMBNAIL ERROR: ', err)
    throw err
  }
}

const generateImageNewKey = (imageKey: string, suffix: string) => {
  const splittedKey = imageKey.split('/')
  let newKey = ''
  splittedKey.forEach((splitted, index, array) => {
    if (index === array.length - 1) {
      newKey += `${suffix}/${splitted}`
      return newKey
    }
    newKey += `${splitted}/`
  })
  return newKey
}
