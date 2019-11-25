import { ObjectAttributeMetadata } from './ObjectAttributeMetadata'

export interface OneToOneMetadata {
  name: string
  truePropertyName: string
  nullable: boolean
  entityTarget: {}
  indexed: boolean
}
