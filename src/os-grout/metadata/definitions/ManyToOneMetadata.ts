export interface ManyToOneMetadata {
  type: Function
  entityTarget: Function
  truePropertyName: string
  required?: boolean
  indexed?: boolean
  name: string
}
