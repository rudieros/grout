import * as AWS from 'aws-sdk'
import { TranscodePresets, TranscodePresetsList } from './TranscodePresets'
import { generateTranscodeParams } from './generateTranscodeParams'

const elastictranscoder = new AWS.ElasticTranscoder()

export class ElasticTranscoderService {
  public async transcodeVideo(input: TranscodeInputModel) {
    let transcodeTypes: TranscodePresets[]
    transcodeTypes = [
      TranscodePresetsList.MediumQuality,
      TranscodePresetsList.AudioQuality,
    ]
    const params = generateTranscodeParams(
      input.key,
      input.outputPrefix,
      transcodeTypes
    )
    params.Outputs[0].ThumbnailPattern = '/thumbnail-{count}'
    return this.createTranscoderJob(params)
  }

  private async createTranscoderJob(input: TranscodeParams): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      elastictranscoder.createJob(input, (err, data) => {
        if (err) {
          console.log('err: ', err)
          reject(err.stack)
        } else {
          console.log('VIDEO TRANSCODER SERVICE | Job created.')
          console.log('VIDEO TRANSCODER SERVICE | data: ', data)
          resolve('VIDEO TRANSCODER SERVICE | Job created.')
        }
      })
    })
  }
}

export class TranscodeInputModel {
  public key: string
  public outputPrefix: string
}

export interface TranscodeParams {
  Input: { Key: string }
  PipelineId: string
  OutputKeyPrefix: string
  Outputs: TranscodeOutput[]
  Playlists: TranscodePlaylist[]
}

export interface TranscodeOutput {
  Key: string
  PresetId: string
  ThumbnailPattern?: string
  SegmentDuration: string
}
export interface TranscodePlaylist {
  Format: string
  Name: string
  OutputKeys: string[]
}
