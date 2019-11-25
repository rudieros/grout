export const parseDefaultSchemaValue = (value: any) => {
  if (value.constructor === Array) {
    return `[${value
      .map((val) => {
        if (val.constructor === String) {
          return `'${val}'`
        } else if (val.constructor === Number) {
          return val
        }
      })
      .join(',')}]`
  }
  if (value.constructor !== Number) {
    return `'${value}'`
  }
  return value
}
