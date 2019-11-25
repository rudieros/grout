export const findTypeForDBSchema = (
  type: Function,
  isArray?: boolean,
  name?: string
) => {
  if (name === 'tags') {
    console.log('Type', type)
  }
  if (type.constructor === Array) {
    if (!type.length) {
      throw new Error(
        'You provided an empty array to an Attribute tag. Please specify the type e.g. [String]'
      )
    }
    switch (type[0]) {
      case String:
        return '[String]'
      case Number:
        return '[Number]'
      case Date:
        return '[Date]'
      default:
        return '[Object]'
    }
  }

  return type.name
}
