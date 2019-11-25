import {
  RelationsTableBaseSchema,
  RelationsTableDB,
} from '../relationsTableBaseSchema'
import { db, Schema } from '../db'
import { TableNames } from '../tableNames'
import { DbEntities } from './_dbEntities'

export interface UserUserRelationDB extends RelationsTableDB {
  queryPartition1: string
  querySort1: string
  queryPartition2: string
  querySort2: string
}

export const UserUserRelationSchema = new Schema(
  {
    ...RelationsTableBaseSchema,
    entityName: {
      type: String,
      required: true,
      default: DbEntities.UserUserRelation,
      forceDefault: true,
    },
  },
  {
    timestamps: true,
  }
)

export const UserUserRelationEntity = db.model<
  UserUserRelationDB,
  RelationsTableDB
>('UserUserRelation', UserUserRelationSchema, {
  tableName: TableNames.RELATIONS,
})
