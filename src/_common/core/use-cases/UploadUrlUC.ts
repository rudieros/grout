import { Inject, Service } from 'typedi'
import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { UploadUrlGenerator } from '../../services/uploadUrlGenerator'
import {
  GetUploadUrlInput,
  UploadURL,
  UploadURLType,
} from '../../models/UploadURL'
import { OSContext } from '../../../context'
import { Config } from '../../../config'
import { generateRandomId } from '@appsimples/os-heimdall/build/src/utils/randomIds'

const storagePath = Config.StorageBucketDirectory

const minBytesPictures = 100
const maxBytesPictures = 100000000

@Service()
export class UploadUrlUC extends BaseUseCase<GetUploadUrlInput, UploadURL> {
  @Inject(UploadUrlGenerator)
  uploadUrlGenerator: UploadUrlGenerator

  @Inject(OSContext)
  context: OSContext

  async execute(input: GetUploadUrlInput): Promise<UploadURL> {
    let keyParams = [storagePath, input.type]
    let minBytes = 100
    let maxBytes = 100000000
    // tslint:disable-next-line:no-magic-numbers
    const expiresInSeconds = 60 // one minute
    const id = generateRandomId()
    switch (input.type) {
      case UploadURLType.ProfilePicture:
        keyParams = keyParams.concat([this.context.uid, `profilePicture_${id}`])
        minBytes = minBytesPictures
        maxBytes = maxBytesPictures
        break
      case UploadURLType.GroupCover:
        keyParams = keyParams.concat([this.context.uid, `groupCover_${id}`])
        minBytes = minBytesPictures
        maxBytes = maxBytesPictures
        break
      case UploadURLType.PostImage:
        keyParams = keyParams.concat([this.context.uid, `postImage_${id}`])
        minBytes = minBytesPictures
        maxBytes = maxBytesPictures
        break
      case UploadURLType.PostVideo:
        keyParams = keyParams.concat([this.context.uid, `video_${id}`])
        minBytes = minBytesPictures
        maxBytes = maxBytesPictures
        break
      default:
        throw new Error('No valid type provided')
    }
    return this.uploadUrlGenerator.generateUploadUrl(keyParams.join('/'), {
      expiresInSeconds,
      // tslint:disable-next-line:no-magic-numbers
      fileLengthRangeBytes:
        (minBytes && maxBytes && [minBytes, maxBytes]) || undefined,
    })
  }
}
