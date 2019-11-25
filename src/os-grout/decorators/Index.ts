import { getMetadataStorage } from '../metadata/getMetadataStorage'

export interface IndexInput {
  indexName: string
}

export const Index: (input: IndexInput) => PropertyDecorator = (input) => (
  target,
  propertyName
) => {
  const { indexName } = input
  const type = Reflect.getMetadata('design:type', target, propertyName)
  if (propertyName.toString() === 'tags') {
    console.log('picture type', type.name)
  }
  // getMetadataStorage().collectAttributeMetadata({
  //   entityTarget: target.constructor,
  //   type,
  //   name: name || propertyName.toString(),
  //   truePropertyName: propertyName.toString(),
  //   default: defaultValue,
  //   forceDefault,
  //   dbType,
  // })
}
