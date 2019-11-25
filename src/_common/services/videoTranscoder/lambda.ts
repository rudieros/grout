import { Callback, Context } from 'aws-lambda'
import { ElasticTranscoderService } from './ElasticTranscoderService'
import { Config } from '../../../config'

export const handler = async (
  event: any,
  context: Context,
  callback: Callback
) => {
  try {
    const key = event.Records[0].s3.object.key
    const input = {
      key: key.replace('%3A', ':'),
      outputPrefix: key
        .slice(0, -4)
        .replace('%3A', ':')
        .replace(
          Config.StorageBucketDirectory,
          Config.StorageBucketTranscodedMediaDirectory
        ),
    }
    console.log('VIDEO TRANSCODER SERVICE | transcoder Input: ', input)
    const transcoder = new ElasticTranscoderService()
    await transcoder.transcodeVideo(input)
    const srcBucketKey = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, ' ')
    )
    await updatePostVideoUrl(srcBucketKey, input.outputPrefix)
  } catch (err) {
    console.log('VIDEO TRANSCODER SERVICE | error: ', err)
  }
}

const updatePostVideoUrl = async (
  originalUrl: string,
  outputPrefix: string
) => {
  const [
    storageFolder,
    entityFolder,
    userId,
    ...otherEntityIds
  ] = originalUrl.split('/')
}
