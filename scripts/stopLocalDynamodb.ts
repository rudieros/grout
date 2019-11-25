import { stop } from 'dynamodb-local'

console.log('Closing local DynamoDB')
stop(Number(process.env.DYNAMODB_LOCAL_PORT) || 8000)
console.log('Local DynamoDB closed successfully')
