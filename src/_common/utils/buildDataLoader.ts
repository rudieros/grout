import * as DataLoader from 'dataloader'
import { MainTableDB } from '../database/mainTableBaseSchema'
import { dedupeDynamoKeys } from './dedupeDynamoKeys'

export const buildDataLoader = <
  Table extends { id: any; sort: any } = MainTableDB
>(
  entity: any
) => {
  return new DataLoader(async (keys: Table[]) => {
    const result = await entity.batchGet(dedupeDynamoKeys(keys))
    const sameSizeResult = keys.map(
      (key) =>
        result.find((res) => {
          return res.id === key.id && res.sort === key.sort
        }) || undefined
    )
    return sameSizeResult
  })
}
