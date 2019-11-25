import { Token } from 'typedi'

export const RecoveryCodeGenerator = new Token<RecoveryCodeGenerator>()

type RecoveryCodeGenerator = (codeLength: any) => () => any
