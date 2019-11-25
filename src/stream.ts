import 'reflect-metadata'
import { Callback, Context, DynamoDBStreamEvent, Handler } from 'aws-lambda'
import { MainTableDB } from './_common/database/mainTableBaseSchema'
import * as AWS from 'aws-sdk'
import { DbEntities } from './_common/database/entities/_dbEntities'
import { setupContainer } from './container'
import { Container } from 'typedi'
import { StreamHandler } from './_common/database/streams/StreamHandler'
import { UserStreamHandler } from './users/data/streams/UserStreamHandler'

/**
 * This file is the entry code for the dynamoDB Table's streams
 * Register your handler for each entity here
 */
const streamHandlers: { [entity: string]: new () => StreamHandler<any> } = {
  [DbEntities.User]: UserStreamHandler,
}

export const handler: Handler = async (
  event: DynamoDBStreamEvent,
  context: Context,
  cb: Callback
) => {
  const events = event.Records
  const container = Container.of(context.awsRequestId)
  setupContainer(container, {} as any)

  const converter = AWS.DynamoDB.Converter

  const inputs = events.reduce((acc, item) => {
    const image: MainTableDB & any = converter.unmarshall(
      item.dynamodb.NewImage
    )
    console.log('image', image)
    if (!image.entityName) {
      console.warn(
        'Stream Warning: document with no `entityName` field present, skipping:',
        image
      )
      return acc
    }
    return {
      ...acc,
      [image.entityName]: [
        ...(acc[image.entityName] || []),
        { document: image, event: item.eventName },
      ],
    }
  }, {})

  const entities = Object.keys(streamHandlers)
  return Promise.all(
    entities.map((entity) => {
      if (inputs[entity] && inputs[entity].length) {
        const streamHandler: StreamHandler<any> = container.get(
          streamHandlers[entity]
        )
        return streamHandler.handleStream(inputs[entity])
      }
      return Promise.resolve()
    })
  )
}
