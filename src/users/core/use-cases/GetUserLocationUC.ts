import { Inject, Service } from 'typedi'
import { BaseUseCase } from '../../../_common/architecture/BaseUseCase'
import { UserDataSource } from '../data-sources/UserDataSource'
import { OSContext } from '../../../context'
import { Location } from '../../../_common/models/Location'

@Service()
export class GetUserLocationUC extends BaseUseCase<string, Location> {
  @Inject(OSContext)
  context: OSContext

  @Inject(UserDataSource)
  userDS: UserDataSource

  async execute(userId: string): Promise<Location> {
    return this.userDS.getUserLocation(userId)
  }
}
