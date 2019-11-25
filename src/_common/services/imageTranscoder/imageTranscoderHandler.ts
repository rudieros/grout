import { Callback, Context, S3Event } from 'aws-lambda'
import { ConfigValidator } from './configValidator'
import { GmImageMagicManager } from './gmImageMagicManager'
import { ImageTranscoderConfig } from './models/imageTranscoderConfig'
import { S3Manager } from './s3Manager'
import { Config } from '../../../config'

export const ImageTranscoder = (config: ImageTranscoderConfig) => async (
  event: S3Event,
  context: Context,
  cb: Callback
) => {
  try {
    const srcBucketName = event.Records[0].s3.bucket.name
    const srcBucketKey = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, ' ')
    )
    if (config.handleOriginal) {
      await config.handleOriginal(srcBucketKey)
    }
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
        srcBucketKey,
        thumbnailOption.thumbnailSuffixName
      )
      thumbnailUrls[thumbnailOption.id] = newKey
      await s3Manager.upload(newKey, resizedImage, imageType)
    }
    validatedConfig.callback(srcBucketKey, thumbnailUrls)
  } catch (err) {
    console.log('ERROR: ', err)
    if (err.message) {
      console.log('ERROR MESSAGE: ', err.message)
    }
  }
}

const generateImageNewKey = (imageKey: string, suffix: string) => {
  const splittedKey = imageKey.split('/')
  // TODO: check why switch storage for generated-storage doesnt work
  // const rootDirectory = splittedKey.find(
  //   (key: string) => key === Config.StorageBucketDirectory
  // )
  // if (rootDirectory) {
  //   splittedKey[splittedKey.indexOf(rootDirectory)] =
  //     Config.StorageBucketTranscodedMediaDirectory
  // }
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
