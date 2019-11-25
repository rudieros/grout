import { getMetadataStorage } from '../metadata/getMetadataStorage'

export interface ManyToOneInput {
  type: any
  required?: boolean
  indexed?: boolean
  name?: string
}

export const ManyToOne: (input: ManyToOneInput) => PropertyDecorator = (
  input
) => (target, propertyName) => {
  const { type, required, indexed, name } = input
  if (name === 'groupThatIsMemberId') {
    console.log('Heyyy')
  }
  getMetadataStorage().collectManyToOneMetadata({
    entityTarget: target.constructor,
    type,
    truePropertyName: propertyName.toString(),
    required,
    indexed,
    name: name || propertyName.toString(),
  })
}
