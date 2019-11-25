import { MainTableBaseSchema, MainTableDB } from '../mainTableBaseSchema'
import { db, Schema } from '../db'
import { TableNames } from '../tableNames'
import { DatabasePictureSchema } from '../models/databasePicture'
import { Picture } from '../../models/Picture'
import { DbEntities } from './_dbEntities'

export interface GroupDB extends MainTableDB {
  name: string
  memberCount?: number
  creatorId: string
  description: string
  currentCity?: string
  country?: string
  googlePlaceGroupId?: string
  tags: {}
  coverPicture: Picture
}

export const GroupSchema = new Schema(
  {
    ...MainTableBaseSchema,
    name: {
      type: String,
      trim: true,
      required: true,
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    creatorId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    currentCity: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    googlePlaceGroupId: {
      type: String,
      trim: true,
    },
    tags: {
      type: Object,
      trim: true,
      required: true,
    },
    coverPicture: DatabasePictureSchema,
    entityName: {
      type: String,
      required: true,
      default: DbEntities.Group,
      forceDefault: true,
    },
  },
  {
    timestamps: true,
  }
)

export const GroupEntity = db.model<GroupDB, MainTableDB>(
  'Group',
  GroupSchema,
  {
    tableName: TableNames.MAIN,
  }
)
