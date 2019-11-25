export interface OneToManyMetadata {
  type: Function
  target: {}
  truePropertyName: string
  foreignKey: string
  counterField?: string
}
