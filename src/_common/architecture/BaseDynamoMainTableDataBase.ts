import { ContainerInstance, Inject, Service } from 'typedi'
import { OSContext } from '../../context'

@Service()
export class BaseDynamoMainTableDataBase {
  @Inject(OSContext)
  context: OSContext

  mapIdToDynamoPrimaryKey(id) {
    return { id }
  }
  mapParamsToDynamoQueryKey1(params: any) {
    throw (new Error('NotImplemented').message =
      'You need to implement BaseDynamoMainTableDataBase.mapParamsToDynamoQueryKey1')
  }
}
