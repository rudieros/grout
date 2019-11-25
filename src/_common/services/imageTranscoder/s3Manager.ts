import { AWSError, S3 } from 'aws-sdk'

export class S3Manager {
  private s3: S3
  constructor(private bucketName: string) {
    this.s3 = new S3()
  }
  public async dowloadImage(key: string) {
    return new Promise<S3.GetObjectOutput>((resolve, reject) => {
      this.s3.getObject(
        {
          Bucket: this.bucketName,
          Key: key,
        },
        (err: AWSError, data: S3.GetObjectOutput) => {
          if (err) {
            console.log('[DOWNLOAD IMAGE] Err: ', err)
            reject(err)
          } else {
            console.log('[DOWNLOAD IMAGE] Successfully finished')
            resolve(data)
          }
        }
      )
    })
  }

  public async upload(
    newBucketKey: string,
    resizedImageData: Buffer,
    imageType: string
  ) {
    return new Promise<string>((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: this.bucketName,
          Key: newBucketKey,
          Body: resizedImageData,
          ContentType: imageType,
        },
        (err: AWSError, data: S3.GetObjectOutput) => {
          if (err) {
            console.log('[UPLOAD IMAGE] Err: ', err)
            reject(err)
          } else {
            console.log('[UPLOAD IMAGE] Successfully finished')
            resolve(newBucketKey)
          }
        }
      )
    })
  }
}
