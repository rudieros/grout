import {
  RelationsTableBaseSchema,
  RelationsTableDB,
} from '../relationsTableBaseSchema'
import { db, Schema } from '../db'
import { TableNames } from '../tableNames'
import { DbEntities } from './_dbEntities'

export interface GroupCampaignRelationDB extends RelationsTableDB {
  postId: string
  campaignId: string
}

export const GroupCampaignRelationSchema = new Schema(
  {
    ...RelationsTableBaseSchema,
    postId: {
      type: String,
      trim: true,
    },
    campaignId: {
      type: String,
      trim: true,
    },
    entityName: {
      type: String,
      required: true,
      default: DbEntities.GroupCauseRelation,
      forceDefault: true,
    },
  },
  {
    timestamps: true,
  }
)

export const GroupCampaignRelationEntity = db.model<
  GroupCampaignRelationDB,
  RelationsTableDB
>('GroupCampaignRelation', GroupCampaignRelationSchema, {
  tableName: TableNames.RELATIONS,
})
