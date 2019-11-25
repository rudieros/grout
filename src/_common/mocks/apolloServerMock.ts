import 'source-map-support/register'
import { createTestClient } from 'apollo-server-testing'
import { ApolloServer } from 'apollo-server-lambda'
import { UserRoles } from '../authorization/UserRoles'
import { Container, ContainerInstance } from 'typedi'
import { OSContext } from '../../context'
import { ResolverData } from 'type-graphql'
import { schema } from '../graphql/schema'

export const createApolloTestClient = (config?: {
  uid?: string
  userRole?: UserRoles
  modifyContainer?(container: ContainerInstance): void
}) =>
  createTestClient(new ApolloServer({
    schema,
    formatResponse: (response: any, { context }: ResolverData<OSContext>) => {
      try {
        response.extensions = {
          authorization: {
            token: context.container.get('token'),
            uid: context.container.get('uid'),
          },
        }
      } catch (err) {}
      // remember to dispose the scoped container to prevent memory leaks
      Container.reset(context.requestId)
      return response
    },
    context: () => {
      const requestId = Math.floor(
        Math.random() * Number.MAX_SAFE_INTEGER
      ).toString() // uuid-like
      const container = Container.of(requestId) // get the scoped container
      const context: Partial<OSContext> = {
        requestId,
        container,
        applyMocks: config && config.modifyContainer,
      } // create fresh context object
      container.set('context', context) // place context or other data in container
      return {
        ...context,
        authorizerContent: {
          uid: config && config.uid,
          userRole: config && config.userRole,
        },
        uid: config && config.uid,
        userRole: config && config.userRole,
      } as OSContext
    },
  }) as any)
