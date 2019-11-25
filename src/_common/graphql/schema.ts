/**
 * Schema Building
 */
import { setupContainer } from '../../container'
import { OSContext } from '../../context'
import { buildSchemaSync, ResolverData } from 'type-graphql'
import { authChecker } from '../authorization/authChecker'
import { resolvers } from '../../resolvers'

export const schema = buildSchemaSync({
  resolvers,
  authChecker,
  dateScalarMode: 'timestamp',
  container: ({ context }: ResolverData<OSContext>) => {
    const container = context.container
    setupContainer(container, context)
    return container
  },
})
