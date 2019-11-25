import { EntityIDMetadata } from './EntityIDMetadata'
import { AttributeMetadata } from './AttributeMetadata'

export interface ObjectAttributeMetadata {
  name: string
  className: string
  target: Function
  id?: EntityIDMetadata
  attributes?: AttributeMetadata[]
}
