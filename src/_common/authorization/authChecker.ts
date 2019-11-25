import { AuthChecker } from 'type-graphql'
import { OSContext } from '../../context'
import { UserRoles } from './UserRoles'

export const authChecker: AuthChecker<OSContext, UserRoles> = (
  { context },
  roles
) => {
  return roles.some((authorizedRole) => {
    return context.authorizerContent.userRole === authorizedRole
  })
}
