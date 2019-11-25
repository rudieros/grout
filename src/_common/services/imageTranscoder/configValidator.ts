import { CONSTANTS } from './constants'
import {
  ImageTranscoderConfig,
  ValidatedImageTranscoderConfig,
} from './models/imageTranscoderConfig'
import { ValidatedThumbnailOption } from './models/thumbnailOptions'
import { ThumbnailSize } from './models/thumbnailSize'

export class ConfigValidator {
  private bucketName: string = ''
  private key: string = ''
  private config?: ImageTranscoderConfig

  constructor(config?: ImageTranscoderConfig) {
    if (config) {
      this.config = config
    }
  }
  public setConfig(config: ImageTranscoderConfig) {
    this.config = config
  }

  public validate(
    bucketName: string,
    key: string
  ): ValidatedImageTranscoderConfig {
    if (!this.config) {
      throw new Error('Config must be set before validating')
    }
    this.bucketName = bucketName
    this.key = key

    const validatedThumbnailOptions = this.validateConfigThumbnailOptions()
    const validatedImageFormats = this.validateImageFormats()
    const validatedCallback = this.validateCallback()
    this.validateBucketName()
    const isValid = this.validateKey(validatedThumbnailOptions)
    if (!isValid) {
      throw new Error(
        'This image came from a folder that can not have a thumbnail associated to it.'
      )
    }
    const validatedOutput = {
      bucketName: this.config.bucketName,
      foldersToWatch: this.config.foldersToWatch || [],
      thumbnailOptions: validatedThumbnailOptions,
      imageFormats: validatedImageFormats,
      callback: validatedCallback,
    }

    return validatedOutput
  }

  private validateConfigThumbnailOptions(): ValidatedThumbnailOption[] {
    if (!this.config) {
      throw new Error('Config must be set before validating')
    }

    let validatedThumbnailOptions: ValidatedThumbnailOption[] = []
    // TODO figure out if this should be here
    // if (this.config.thumbnailSize && this.config.thumbnailSize!.length) {
    //   this.config.thumbnailSize!.forEach((size) => {
    //     switch (size) {
    //       case ThumbnailSize.small:
    //         validatedThumbnailOptions.push(CONSTANTS.ThumbnailSizeSmall)
    //         break
    //       case ThumbnailSize.medium:
    //         validatedThumbnailOptions.push(CONSTANTS.ThumbnailSizeMedium)
    //         break
    //       case ThumbnailSize.large:
    //         validatedThumbnailOptions.push(CONSTANTS.ThumbnailSizeLarge)
    //         break
    //     }
    //   })
    // }

    if (
      !(this.config.thumbnailSize && this.config.thumbnailSize!.length) &&
      !(this.config.thumbnailOptions && this.config.thumbnailOptions!.length)
    ) {
      validatedThumbnailOptions = [
        {
          width: 50,
          height: 50,
          resizeOption: '%',
          thumbnailSuffixName: 'thumbnail1',
          id: 'thumbnail1',
        },
      ]
    } else {
      if (this.config.thumbnailOptions) {
        validatedThumbnailOptions = validatedThumbnailOptions.concat(
          this.config.thumbnailOptions!.map((option, index) => ({
            height: option.height || 50,
            width: option.width || 50,
            resizeOption: option.resizeOption || '%',
            id: option.id || `thumbnail${index + 1}`,
            thumbnailSuffixName:
              option.thumbnailSuffixName || `thumbnail${index + 1}`,
          }))
        )
      }
    }
    return validatedThumbnailOptions
  }

  private validateImageFormats(): string[] {
    if (!this.config) {
      throw new Error('Config must be set before validating')
    }

    const validatedImageFormats = this.config.imageFormats || [
      'jpg',
      'png',
      'jpeg',
    ]
    return validatedImageFormats
  }

  private validateCallback() {
    if (!this.config) {
      throw new Error('Config must be set before validating')
    }

    const callback = () => {
      return
    }
    return this.config.callback || callback
  }

  private validateBucketName(): void {
    if (!this.config) {
      throw new Error('Config must be set before validating')
    }

    if (this.bucketName !== this.config.bucketName) {
      throw new Error('S3Event bucket name is not the same as set in config')
    }
  }

  private validateKey(
    validatedThumbnailOptions: ValidatedThumbnailOption[]
  ): boolean {
    if (!this.config) {
      throw new Error('Config must be set before validating')
    }

    let isValid = true
    validatedThumbnailOptions.forEach((option) => {
      if (
        option.thumbnailSuffixName &&
        this.key.indexOf(option.thumbnailSuffixName) !== -1
      ) {
        isValid = false
      }
    })
    if (
      this.config.foldersToWatch &&
      !this.config.foldersToWatch.some(
        (folderToWatch) => this.key.indexOf(folderToWatch) !== -1
      )
    ) {
      isValid = false
    }
    return isValid
  }
}
