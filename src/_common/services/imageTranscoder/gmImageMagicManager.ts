import gmImageMagic from 'gm'
import { ValidatedThumbnailOption } from './models/thumbnailOptions'

export class GmImageMagicManager {
  private imageMagic: gmImageMagic.SubClass
  constructor() {
    this.imageMagic = gmImageMagic.subClass({ imageMagick: true })
  }

  public async identifyImageFormat(imageFormats: string[], imageData?: Buffer) {
    if (!imageData) {
      throw new Error(
        'An error ocurred during downloading image, because image data body is undefined'
      )
    }
    return new Promise<string>((resolve, reject) => {
      this.imageMagic(imageData).identify((err, data) => {
        if (err) {
          console.log('[IDENTIFY IMAGE] Err: ', err)
          reject(err)
        } else {
          let identifiedFormat = 'invalid_format'
          imageFormats.forEach((format) => {
            if (format.toLowerCase() === data.format.toLowerCase()) {
              identifiedFormat = format
            }
          })
          if (identifiedFormat === 'invalid_format') {
            throw new Error('Image format is invalid')
          }
          console.log('[IDENTIFY IMAGE] identifiedFormat: ', identifiedFormat)
          resolve(identifiedFormat)
        }
      })
    })
  }

  public async resizeImage(
    thumbnailOption: ValidatedThumbnailOption,
    bucketKey: string,
    imageData: Buffer,
    imageType: string
  ) {
    const [width, height, resizeOption] = [
      thumbnailOption.width,
      thumbnailOption.height,
      thumbnailOption.resizeOption,
    ]
    return new Promise<Buffer>((resolve, reject) => {
      this.imageMagic(imageData, bucketKey)
        .resize(width, height, resizeOption)
        .toBuffer(imageType, (err, buffer) => {
          if (err) {
            console.log('[RESIZE IMAGE] Err: ', err)
            reject(err)
          } else {
            console.log('[RESIZE IMAGE] Successfully finished')
            resolve(buffer)
          }
        })
    })
  }
}
