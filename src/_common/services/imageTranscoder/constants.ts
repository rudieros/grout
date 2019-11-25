import { ValidatedThumbnailOption } from './models/thumbnailOptions'

export namespace CONSTANTS {
  export const ThumbnailSizeSmall: ValidatedThumbnailOption = {
    width: 25,
    height: 25,
    resizeOption: '%',
    thumbnailSuffixName: 'thumbnailSmall',
    id: 'thumbnailSmall',
  }

  export const ThumbnailSizeMedium: ValidatedThumbnailOption = {
    width: 50,
    height: 50,
    resizeOption: '%',
    thumbnailSuffixName: 'thumbnailMedium',
    id: 'thumbnailMedium',
  }

  export const ThumbnailSizeLarge: ValidatedThumbnailOption = {
    width: 75,
    height: 75,
    resizeOption: '%',
    thumbnailSuffixName: 'thumbnailLarge',
    id: 'thumbnailLarge',
  }
}
