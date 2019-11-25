import { db, Schema } from '../db'
import { TableNames } from '../tableNames'
import {
  RelationsTableBaseSchema,
  RelationsTableDB,
} from '../relationsTableBaseSchema'
import { DbEntities } from './_dbEntities'

export interface UserGroupRelationDB extends RelationsTableDB {
  userId: string
}
export const UserGroupRelationSchema = new Schema(
  {
    ...RelationsTableBaseSchema,
    userId: {
      type: String,
      trim: true,
    },
    entityName: {
      type: String,
      required: true,
      default: DbEntities.UserGroupRelation,
      forceDefault: true,
    },
  },
  {
    timestamps: true,
  }
)

export const UserGroupRelationsEntity = db.model<
  UserGroupRelationDB,
  RelationsTableDB
>('UserGroupRelation', UserGroupRelationSchema, {
  tableName: TableNames.RELATIONS,
})
