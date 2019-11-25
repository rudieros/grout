import 'source-map-support/register'
import 'reflect-metadata'
import { Callback, Context } from 'aws-lambda'
import { Config } from '../../config'
import { handler as VideoTranscoderHandler } from './videoTranscoder/lambda'
import { handler as ImageTranscoderHandler } from './imageTranscoder/lambda'

export const handler = async (
  event: any,
  context: Context,
  callback: Callback
) => {
  const pathFolders = getPathFolders(event)
  if (shouldCallVideoTranscoder(pathFolders)) {
    console.log('VIDEO TRANSCODER SERVICE | Starting Video Transcoder')
    await VideoTranscoderHandler(event, context, callback)
  } else {
    console.log('VIDEO TRANSCODER SERVICE | Starting Image Transcoder')
    await ImageTranscoderHandler(event, context, callback)
  }
}

export const getPathFolders = (event: any) => {
  const srcBucketKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  )
  return srcBucketKey.split('/')
}

const shouldCallVideoTranscoder = (folders: string[]) => {
  return !!(folders && folders[1] === Config.StorageBucketVideosDirectory)
}
