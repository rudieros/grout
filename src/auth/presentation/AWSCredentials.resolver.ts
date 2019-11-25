import { Authorized, Query, Resolver } from 'type-graphql'
import { UserRoles } from '../../_common/authorization/UserRoles'
import { OSContext } from '../../context'
import { Inject, Service } from 'typedi'
import { AWSCredentials } from '../../_common/models/AWSCredentials'
import { GetAWSCredentialsUseCase } from '../core/GetAWSCredentialsUseCase'

@Resolver(AWSCredentials)
@Service()
export class AWSCredentialsResolver {
  @Inject(OSContext)
  context: OSContext

  @Authorized(UserRoles.user)
  @Query((returns) => AWSCredentials)
  async getCredentials() {
    const uc = this.context.container.get(GetAWSCredentialsUseCase)
    return uc.execute()
  }
}
