export interface MainTableDB {
  id: string
  sort: string
  queryPartition1?: string
  querySort1?: string
  queryPartition2?: string
  querySort2?: string
  entityName?: string
}
export const MainTableBaseSchema = {
  id: {
    type: String,
    hashKey: true,
  },
  sort: {
    type: String,
    rangeKey: true,
  },
  queryPartition1: {
    type: String,
    required: false,
    index: {
      name: 'queryKey1Index',
      rangeKey: 'querySort1',
      global: true,
    },
  },
  querySort1: {
    required: false,
    type: String,
  },
  queryPartition2: {
    type: String,
    required: false,
    index: {
      name: 'queryKey2Index',
      rangeKey: 'querySort2',
      global: true,
    },
  },
  querySort2: {
    required: false,
    type: String,
  },
}
