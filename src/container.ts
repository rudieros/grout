import { ContainerInstance } from 'typedi'
import { UserDataSource } from './users/core/data-sources/UserDataSource'
import { UserDynamoDataBase } from './users/data/UserDynamoDataBase'
import { EmailService, SesEmailService } from './_common/services/emailService'
import { OSContext } from './context'
import { RecoveryCodeGenerator } from './_common/services/recoveryCodeGenerator'
import { randomNumberCode } from '@appsimples/os-heimdall/build/src/utils/randomNumberCode'
import { CampaignDataSource } from './campaign/core/data-sources/CampaignDataSource'
import { DynamoCampaignDataBase } from './campaign/data/DynamoCampaignDataBase'
import {
  S3UploadUrlGenerator,
  UploadUrlGenerator,
} from './_common/services/uploadUrlGenerator'
import { Config } from './config'

/**
 * Container setup is done here
 * inject your service to your container
 * @param container
 * @param context
 */
export const setupContainer = (
  container: ContainerInstance,
  context: OSContext
) => {
  container.set(OSContext, context)

  container.set(UserDataSource, container.get(UserDynamoDataBase))
  container.set(CampaignDataSource, container.get(DynamoCampaignDataBase))
  container.set(EmailService, container.get(SesEmailService))
  container.set(RecoveryCodeGenerator, randomNumberCode)
  container.set(
    UploadUrlGenerator,
    new S3UploadUrlGenerator(Config.StorageBucketName)
  )

  // apply mocks from tests
  if (context.applyMocks) {
    context.applyMocks(container)
  }
}
