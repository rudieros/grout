import { SecureAuthInfo } from '@appsimples/os-heimdall/build/src'

/**
 * This is not a GraphQL Model!
 */
export interface Auth extends SecureAuthInfo {
  userName: string
  emailVerified: boolean
  emailConfirmationCode?: any
}
