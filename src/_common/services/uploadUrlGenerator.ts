import { S3 } from 'aws-sdk'
import { Config } from '../../config'
import { Service, Token } from 'typedi'

const s3 = new S3()
export const UploadUrlGenerator = new Token<UploadUrlGenerator>()

export interface UploadUrlOutput {
  url: string
  key: string
  bucket: string
  xAmzAlgorithm: string
  xAmzCredential: string
  xAmzDate: string
  policy: string
  xAmzSignature: string
  xAmzSecurityToken: string
}

export interface UploadUrlGenerator {
  generateUploadUrl(
    key: string,
    config?: {
      expiresInSeconds?: number | undefined
      fileLengthRangeBytes?: undefined | number[]
    }
  ): Promise<UploadUrlOutput>
}

@Service()
export class S3UploadUrlGenerator implements UploadUrlGenerator {
  constructor(private bucketName: string) {}

  // tslint:disable-next-line:typedef
  async generateUploadUrl(
    key: string,
    config: { expires?: number; fileLengthRangeBytes?: number[] } = {}
  ) {
    return new Promise<UploadUrlOutput>((resolve, reject) => {
      const conditions = [['starts-with', '$key', key] as any]
      if (config.fileLengthRangeBytes) {
        conditions.push([
          'content-length-range',
          config.fileLengthRangeBytes[0],
          config.fileLengthRangeBytes[1],
        ])
      }
      s3.createPresignedPost(
        {
          Bucket: this.bucketName,
          Conditions: conditions,
          Expires: config.expires,
        },
        (err, data) => {
          if (err) {
            return reject(err)
          }
          resolve({
            url: data.url,
            key,
            bucket: data.fields.bucket,
            xAmzAlgorithm: data.fields['X-Amz-Algorithm'],
            xAmzCredential: data.fields['X-Amz-Credential'],
            xAmzDate: data.fields['X-Amz-Date'],
            policy: data.fields.Policy,
            xAmzSignature: data.fields['X-Amz-Signature'],
            xAmzSecurityToken: data.fields['X-Amz-Security-Token'],
          })
        }
      )
    })
  }
}
