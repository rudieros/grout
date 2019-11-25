import { ResizeOption } from './resizeOption'

export interface ThumbnailOptions {
  width?: number // default: 50
  height?: number // default: 50
  resizeOption?: ResizeOption // default: %
  thumbnailSuffixName?: string // default: thumbanail1, thumbanail2, thumbnail3, ...
  id: any
}

export type ValidatedThumbnailOption = ThumbnailOptions &
  Required<{
    width: number
    height: number
    resizeOption: ResizeOption
    thumbnailSuffixName: string
  }>
