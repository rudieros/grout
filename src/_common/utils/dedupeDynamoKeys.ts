export const dedupeDynamoKeys = <Key>(keys: Key[]) => {
  const keyMap: { [keyProperty: string]: boolean } = {}
  const dedupedKeys: Key[] = []
  keys.forEach((key) => {
    const keyProperties = Object.entries(key)
    let thisKeyHasSomeNewProperty = false
    keyProperties.forEach(([property, value]) => {
      const keyPropAlreadyExists = keyMap[`${property}_${value}`]
      if (!keyPropAlreadyExists) {
        thisKeyHasSomeNewProperty = true
      }
      keyMap[`${property}_${value}`] = true
    })
    if (thisKeyHasSomeNewProperty) {
      dedupedKeys.push(key)
    }
  })
  return dedupedKeys
}
