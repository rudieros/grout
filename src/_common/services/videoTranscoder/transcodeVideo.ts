import { Config } from '../../../config'
import { ElasticTranscoderService } from './ElasticTranscoderService'

export const transcodeVideo = async (videoKey: string) => {
  try {
    const key = videoKey
    const input = {
      key: key.replace('%3A', ':'),
      outputPrefix: key
        // tslint:disable-next-line:no-magic-numbers
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
    // const srcBucketKey = decodeURIComponent(
    //   videoKey.replace(/\+/g, ' ')
    // )
    return {
      original: videoKey,
      transcoded: input.outputPrefix,
    }
  } catch (err) {
    console.log('VIDEO TRANSCODER SERVICE | error: ', err)
  }
}
