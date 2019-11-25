import { BaseUseCase } from '../../_common/architecture/BaseUseCase'
import { AWSCredentials } from '../../_common/models/AWSCredentials'
import { AwsCredentialsProvider } from '@appsimples/os-heimdall/build/src'
import { Config } from '../../config'
import { Inject, Service } from 'typedi'
import { OSContext } from '../../context'

@Service()
export class GetAWSCredentialsUseCase extends BaseUseCase<
  undefined,
  AWSCredentials
> {
  @Inject(OSContext)
  context: OSContext

  async execute(): Promise<AWSCredentials> {
    const credentialsProvider = new AwsCredentialsProvider({
      assumeRoleArn: Config.UserRoleArn,
    })
    const uid = this.context.uid
    const credentials = await credentialsProvider.getCredentials(
      uid,
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: 's3:PutObject',
            Resource: `arn:aws:s3:::${Config.StorageBucketName}/${Config.StorageBucketDirectory}/${Config.StorageBucketUserDirectory}/${uid}/*`,
            Effect: 'Allow',
          },
          {
            Action: 's3:PutObject',
            Resource: `arn:aws:s3:::${Config.StorageBucketName}/${Config.StorageBucketDirectory}/${Config.StorageBucketGroupsDirectory}/${uid}/*`,
            Effect: 'Allow',
          },
          {
            Action: 's3:PutObject',
            Resource: `arn:aws:s3:::${Config.StorageBucketName}/${Config.StorageBucketDirectory}/${Config.StorageBucketPostsDirectory}/${uid}/*`,
            Effect: 'Allow',
          },
          {
            Action: 's3:PutObject',
            Resource: `arn:aws:s3:::${Config.StorageBucketName}/${Config.StorageBucketDirectory}/${Config.StorageBucketCampaignDirectory}/${uid}/*`,
            Effect: 'Allow',
          },
        ],
      })
    )
    return {
      awsAccessKeyId: credentials.accessKeyId,
      awsSecretKey: credentials.secretKey,
      sessionToken: credentials.sessionToken,
      expirationTimestamp: new Date((credentials as any).expiration).getDate(), // TODO remove any when heimdall updates
    }
  }
}
