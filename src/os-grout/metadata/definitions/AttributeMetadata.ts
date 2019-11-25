import { ObjectAttributeMetadata } from './ObjectAttributeMetadata'
import { EntityMetadata } from './EntityMetadata'

export interface AttributeMetadata {
  name: string
  type: Function
  entityTarget: {}
  truePropertyName: string
  default?: any
  forceDefault?: boolean
  dbType?: any
  objectAttributeTarget?: any
  objectAttribute?: ObjectAttributeMetadata | ObjectAttributeMetadata[]
  isPartitionKey?: boolean
  isSortKey?: boolean
  isRelationSynthetic?: boolean
  partitionKeyName?: string
  sortKeyName?: string
  indexName?: string
  unique?: boolean | { indexName: string }
  skipDatabaseDeclaration?: boolean
  overrideHasQuestionToken?: boolean
  isRelationCounter?: boolean
  isOneToMany?: boolean
  isManyToOne?: boolean
  relationEntity?: EntityMetadata
}
