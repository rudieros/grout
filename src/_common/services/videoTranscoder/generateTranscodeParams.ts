import { TranscodeParams } from './ElasticTranscoderService'
import { Config } from '../../../config'
import { TranscodePresets } from './TranscodePresets'

export const generateTranscodeParams = (
  key: string,
  outputPrefix: string,
  presets: TranscodePresets[]
) => {
  const params: TranscodeParams = {
    Input: { Key: key },
    Outputs: presets.map((item) => ({
      Key: `/output/${item.name}`,
      PresetId: item.presetId,
      SegmentDuration: '10',
    })),
    Playlists: [
      {
        Format: 'HLSv4',
        Name: '/playlist',
        OutputKeys: presets.map((item) => `/output/${item.name}`),
      },
    ],
    OutputKeyPrefix: outputPrefix,
    PipelineId: Config.ElasticTranscoderPipelineId,
  }
  return params
}
