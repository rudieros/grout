export abstract class StreamHandler<Entity> {
  abstract handleStream(
    documents: StreamHandlerInput<Entity>[]
  ): Promise<void> | void
}

export interface StreamHandlerInput<Entity> {
  document: Entity
  event: 'INSERT' | 'add other events'
}
