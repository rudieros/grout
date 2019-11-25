import { TableDefinition } from './TableDefinition'

export const getDefaultTableDefinition = (
  projectName: string = 'UnnamedTable'
) =>
  new TableDefinition({
    name: projectName,
    primaryKey: {
      partition: { name: 'id', type: String },
      sort: { name: 'sort', type: String },
    },
    indexes: [
      {
        name: 'index1',
        partition: { name: 'queryPartition1', type: String },
        sort: { name: 'querySort1', type: String },
      },
      {
        name: 'index2',
        partition: { name: 'queryPartition2', type: String },
        sort: { name: 'querySort2', type: String },
      },
      {
        name: 'index3',
        partition: { name: 'queryPartition3', type: String },
        sort: { name: 'querySort3', type: String },
      },
    ],
  })
