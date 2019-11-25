export const generateRandomCode = (length: number) => () => {
  const base = 10
  const randomNumber = (Math.random() * Math.pow(base, length)).toFixed(0)

  return randomNumber
}
