export class TableDefinition {
  name: string
  primaryKey: Omit<KeyType, 'name'>
  indexes: KeyType[]
  constructor(
    private definition: {
      name: string
      primaryKey: Omit<KeyType, 'name'>
      indexes?: KeyType[]
    }
  ) {
    this.name = definition.name
    this.primaryKey = definition.primaryKey
    this.indexes = definition.indexes
  }
}

interface KeyType {
  name: string
  partition: KeyAttributeType
  sort?: KeyAttributeType
}

interface KeyAttributeType {
  // tslint:disable-next-line:ban-types
  type: typeof Number | typeof String
  name: string
}
