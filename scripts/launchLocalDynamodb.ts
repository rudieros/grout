import './setupTestEnvironmentVariables'
import { configureInstaller, launch } from 'dynamodb-local'

export const launchLocalDynamoDb = async () => {
  console.log('Start configuring local DynamoDB for testing')
  configureInstaller({
    installPath: './.dynamodb',
    downloadUrl:
      'https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.tar.gz',
  } as any)
  await launch(Number(process.env.DYNAMODB_LOCAL_PORT) || 8000, null, [
    '-sharedDb',
  ])
  console.log('Local DynamoDB for testing launched successfully')
}
