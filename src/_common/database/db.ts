import * as dynamoose from '@appsimples/dynamoose'

if (process.env.IS_OFFLINE) {
  dynamoose.local()
}

dynamoose.setDefaults({
  // create: !!process.env.IS_OFFLINE, // only force create the tables for local development and testing
  // update: !!process.env.IS_OFFLINE, // only force create the tables for local development and testing
  create: true,
  update: true,
  streamOptions: {
    // sets table stream options
    enabled: true, // sets if stream is enabled on the table
    type: 'NEW_AND_OLD_IMAGES', // sets the stream type (NEW_IMAGE | OLD_IMAGE | NEW_AND_OLD_IMAGES | KEYS_ONLY) (https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_StreamSpecification.html#DDB-Type-StreamSpecification-StreamViewType)
  },
})

export const db = dynamoose
export const Schema = db.Schema
