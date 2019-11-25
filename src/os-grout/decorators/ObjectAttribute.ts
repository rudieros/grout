import { getMetadataStorage } from '../metadata/getMetadataStorage'

export interface ObjectAttributeInput {
  name?: string
}

export const ObjectAttribute: (
  input?: ObjectAttributeInput
) => ClassDecorator = (input = {}) => (target) => {
  const { name } = input
  getMetadataStorage().collectObjectAttributeMetadata({
    target,
    className: name,
    name: name || `${target.name}Entity`,
  })
}
