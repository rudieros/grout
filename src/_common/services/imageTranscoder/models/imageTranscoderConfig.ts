import { ThumbnailOptions, ValidatedThumbnailOption } from './thumbnailOptions'
import { ThumbnailSize } from './thumbnailSize'

export interface ImageTranscoderConfig {
  bucketName: string
  foldersToWatch?: string[]
  thumbnailOptions?: ThumbnailOptions[]
  thumbnailSize?: ThumbnailSize[] // if set, thumbnailOptions will not be ignored and added too
  imageFormats?: string[] // default: ['jpg','png','jpeg']
  handleOriginal?: (originalPath: string) => Promise<any>
  callback?: (
    originalPath: string,
    thumbnailLinks: { [id: string]: string }
  ) => {} | void // no important default
}

export type ValidatedImageTranscoderConfig = ImageTranscoderConfig &
  Required<{
    foldersToWatch: string[]
    thumbnailOptions: ValidatedThumbnailOption[]
    imageFormats: string[]
    callback?: (
      originalPath: string,
      thumbnailLinks: { [id: string]: string }
    ) => {} | void
  }>
