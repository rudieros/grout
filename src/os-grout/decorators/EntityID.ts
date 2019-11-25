import { getMetadataStorage } from '../metadata/getMetadataStorage'

export interface EntityIDInput {}

export const EntityID: (input?: EntityIDInput) => PropertyDecorator = (
  input = {}
) => (target, propertyName) => {
  const type = Reflect.getMetadata('design:type', target, propertyName)
  getMetadataStorage().collectEntityIDMetadata({
    entityTarget: target.constructor,
    name: propertyName.toString(),
    type,
    uuid: false,
  })
}
