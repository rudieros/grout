export interface AuthorizerConfig {
  entities: AuthorizerEntityConfig[]
  osTokenHeader?: string
  federatedTokenHeader?: string
  tokenTableName: string
  tokenTablePrimaryKey?: string
  publicRoutes?: string[]
  basePath: string
  facebook: {
    clientId: string
    clientSecret: string
  }
  onAuthorizerSuccess?: (
    validatedInput: ValidatedAuthorizerInput
  ) => Promise<any>
}

export interface ValidatedAuthorizerInput {
  uid: string
  userRole: string
  token: string
}

export const AuthorizerConfigDefaults = {
  osTokenHeader: 'Authorization',
  federatedTokenHeader: 'Authorization',
  autoConfirmUsers: true,
  autoVerifyAttributes: [],
  tokenPrimaryKey: 'uid',
}

export interface AuthorizerEntityConfig {
  identityPoolId: string
  facebookRole?: string
  role?: string
  apiKeyToRoleMapper?: (apiKey: string) => string
  apiKeyToClientIdMapper?: (apiKey: string) => string
  userPools: AuthorizerUserPoolConfig[]
}

export interface AuthorizerUserPoolConfig {
  poolId: string
  role: string
  usernameAttributes: UserPoolAttributes[]
  defaultClientId?: string
  autoConfirmUsers?: boolean
  autoVerifyAttributes?: UserPoolAttributes[]
}

export enum UserPoolAttributes {
  email = 'email',
  phone_number = 'phone_number',
}
