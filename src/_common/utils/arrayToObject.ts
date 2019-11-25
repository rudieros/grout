export const arrayToObject = (input: string[]) => {
  const outputObject = {}
  input.forEach((item, i) => (outputObject[i] = item))
  return outputObject
}

export const objectToArray = (input: any): string[] => {
  return Object.values(input)
}
