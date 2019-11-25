import { getMetadataStorage } from '../metadata/getMetadataStorage'
import { TableDefinition } from '../dynamo/TableDefinition'
import { getDefaultTableDefinition } from '../dynamo/getDefaultTableDefinition'

export interface EntityInput {
  name?: string
  table?: TableDefinition
  tableName?: string
}

export const Entity: (input?: EntityInput) => ClassDecorator = (input = {}) => (
  target
) => {
  const { name, table, tableName } = input
  getMetadataStorage().collectEntityMetadata({
    target,
    className: target.name,
    name: name || `${target.name}`,
    tableDefinition: table || getDefaultTableDefinition(tableName),
    indexUse: [],
  })
}
