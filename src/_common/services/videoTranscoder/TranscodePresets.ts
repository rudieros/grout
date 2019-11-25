export interface TranscodePresets {
  presetId: string
  name: string
}

export const TranscodePresetsList = {
  HighestQuality: { presetId: '1351620000001-200015', name: '2M' }, // HLS v3 and v4 (Apple HTTP Live Streaming), 2 megabits/second, Video-only
  HighQuality: { presetId: '1351620000001-200025', name: '15M' }, // HLS v3 and v4 (Apple HTTP Live Streaming), 1.5 megabits/second, Video-only
  MediumQuality: { presetId: '1351620000001-200035', name: '1M' }, // HLS v3 and v4 (Apple HTTP Live Streaming), 1 megabit/second, Video-only
  LowQuality: { presetId: '1351620000001-200045', name: '600k' }, // HLS v3 and v4 (Apple HTTP Live Streaming), 600 kilobits/second, Video-only
  LowestQuality: { presetId: '1351620000001-200055', name: '400k' }, // HLS v3 and v4 (Apple HTTP Live Streaming), 400 kilobits/second, Video-only
  AudioQuality: { presetId: '1351620000001-200060', name: 'aud' }, // AUDIO ONLY: HLS v3 and v4 Audio, 160 k
}
