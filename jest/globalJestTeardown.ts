import { stop } from 'dynamodb-local'

module.exports = async () => {
  console.log('Closing local DynamoDB')
  await stop(Number(process.env.DYNAMODB_LOCAL_PORT) || 8000)
  console.log('Local DynamoDB closed successfully')
}

