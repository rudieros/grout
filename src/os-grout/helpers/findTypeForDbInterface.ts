export const findTypeForDBInterface = (
  type: Function,
  isArray?: boolean,
  name?: string
) => {
  if (type.constructor === Array) {
    if (!type.length) {
      throw new Error(
        'You provided an empty array to an Attribute tag. Please specify the type e.g. [String]'
      )
    }
    return findTypeForDBInterface(type[0], true)
  }
  switch (type) {
    case String:
      return `string${isArray ? '[]' : ''}`
    case Number:
      return `number${isArray ? '[]' : ''}`
    case Date:
      return `Date${isArray ? '[]' : ''}`
    default:
      return `${type.name}${isArray ? '[]' : ''}`
  }
}
