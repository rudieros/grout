import { getMetadataStorage } from '../metadata/getMetadataStorage'

export interface AttributeInput {
  name?: string
  default?: any
  forceDefault?: boolean
  type?: StringConstructor | ObjectConstructor | NumberConstructor | any
  unique?: boolean | { indexName: string }
}

export const Attribute: (input?: AttributeInput) => PropertyDecorator = (
  input = {}
) => (target, propertyName) => {
  const {
    default: defaultValue,
    name,
    type: dbType,
    forceDefault,
    unique,
  } = input
  const type = Reflect.getMetadata('design:type', target, propertyName)
  getMetadataStorage().collectAttributeMetadata({
    entityTarget: target.constructor,
    type,
    name: name || propertyName.toString(),
    truePropertyName: propertyName.toString(),
    default: defaultValue,
    forceDefault,
    dbType,
    unique,
  })
}
