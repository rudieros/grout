import { MainTableBaseSchema, MainTableDB } from '../mainTableBaseSchema'
import { StatusOfCampaign } from '../../models/Campaign'
import { db, Schema } from '../db'
import { TableNames } from '../tableNames'
import { DatabasePictureSchema } from '../models/databasePicture'
import { Picture } from '../../models/Picture'
import { DbEntities } from './_dbEntities'

export interface CampaignDB extends MainTableDB {
  name: string
  description: string
  expirationDate: number
  status: StatusOfCampaign
  campaignPicture?: Picture[]
}

export const CampaignSchema = new Schema(
  {
    ...MainTableBaseSchema,
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    expirationDate: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      trim: true,
      required: true,
    },
    campaignPicture: {
      type: 'list',
      list: [DatabasePictureSchema],
      required: false,
    },
    entityName: {
      type: String,
      required: true,
      default: DbEntities.Cause,
      forceDefault: true,
    },
  },
  {
    timestamps: true,
  }
)

export const CampaignEntity = db.model<CampaignDB, MainTableDB>(
  'Campaign',
  CampaignSchema,
  {
    tableName: TableNames.MAIN,
  }
)
