import { ContainerInstance, Token } from 'typedi'

export const OSContext = new Token<OSContext>() // TODO use this instead of string 'context' in injectors

export interface OSContext {
  uid: string | undefined
  authorizerContent: any
  userRole: any | undefined
  requestId: string
  container: ContainerInstance
  applyMocks?(container: ContainerInstance): void
}
