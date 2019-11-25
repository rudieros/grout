import { EntityIDMetadata } from './EntityIDMetadata'
import { AttributeMetadata } from './AttributeMetadata'
import { TableDefinition } from '../../dynamo/TableDefinition'
import { IndexUseMetadata } from './IndexUseMetadata'
import { ManyToOneMetadata } from './ManyToOneMetadata'
import { OneToManyMetadata } from './OneToManyMetadata'

export interface EntityMetadata {
  name: string
  className: string
  target: Function
  id?: EntityIDMetadata
  attributes?: AttributeMetadata[]
  tableDefinition: TableDefinition
  indexUse: IndexUseMetadata[]
  isRelationSynthetic?: boolean
  oneToManyRelations?: OneToManyMetadata[]
  manyToOneRelations?: ManyToOneMetadata[]
}
