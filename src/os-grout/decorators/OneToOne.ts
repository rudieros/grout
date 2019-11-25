import { getMetadataStorage } from '../metadata/getMetadataStorage'

export interface OneToOneInput {
  name?: string
  nullable?: boolean
  indexed?: boolean
}

export const OneToOne: (input?: OneToOneInput) => PropertyDecorator = (
  input = {}
) => (target, propertyName) => {
  getMetadataStorage().collectOneToOneMetadata({
    entityTarget: target.constructor,
    name: input.name || propertyName.toString(),
    truePropertyName: propertyName.toString(),
    nullable: input.nullable || false,
    indexed: input.indexed,
  })
}
