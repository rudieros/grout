import { MainTableBaseSchema, MainTableDB } from '../mainTableBaseSchema'
import { db, Schema } from '../db'
import { TableNames } from '../tableNames'
import { DbEntities } from './_dbEntities'
import { SubscriptionPlanTypes } from '../../models/SubscriptionPlan'

export interface SubscriptionPlanDB extends MainTableDB {
  userId: string
  subscriptionDate: Date
  expirationDate: Date
  planType: SubscriptionPlanTypes
  cancellationDate?: Date
}

export const SubscriptionPlanSchema = new Schema(
  {
    ...MainTableBaseSchema,
    userId: {
      type: String,
      required: true,
    },
    subscriptionDate: {
      type: Date,
      required: true,
    },
    cancellationDate: {
      type: Date,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    planType: {
      type: String,
      enum: Object.values(SubscriptionPlanTypes),
      required: true,
    },
    entityName: {
      type: String,
      required: true,
      default: DbEntities.SubscriptionPlan,
      forceDefault: true,
    },
  },
  {
    timestamps: true,
    useDocumentTypes: true,
  }
)

export const SubscriptionPlanEntity = db.model<SubscriptionPlanDB, MainTableDB>(
  'SubscriptionPlan',
  SubscriptionPlanSchema,
  {
    tableName: TableNames.MAIN,
  }
)
