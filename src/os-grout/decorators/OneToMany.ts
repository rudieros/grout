import { getMetadataStorage } from '../metadata/getMetadataStorage'

export interface OneToManyInput {
  type: any
  foreignKey: string
  counterField?: string
}

export const OneToMany: (input: OneToManyInput) => PropertyDecorator = (
  input
) => (target, propertyName) => {
  const { type, counterField, foreignKey } = input
  if (counterField === 'ownedGroupsCounter') {
    console.log('aaaa')
  }
  getMetadataStorage().collectOneToManyMetadata({
    type,
    target,
    foreignKey,
    truePropertyName: propertyName.toString(),
    counterField,
  })
}
