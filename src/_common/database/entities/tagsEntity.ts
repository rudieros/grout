import { MainTableBaseSchema, MainTableDB } from '../mainTableBaseSchema'
import { db, Schema } from '../db'
import { TableNames } from '../tableNames'
import { DbEntities } from './_dbEntities'
export interface TagDB extends MainTableDB {
  en: string
  pt: string
}

export const TagsSchema = new Schema(
  {
    ...MainTableBaseSchema,
    en: {
      type: String,
      trim: true,
    },
    pt: {
      type: String,
      trim: true,
    },
    entityName: {
      type: String,
      required: true,
      default: DbEntities.Tags,
      forceDefault: true,
    },
  },
  {
    timestamps: true,
  }
)

export const TagsEntity = db.model<TagDB, MainTableDB>('Tag', TagsSchema, {
  tableName: TableNames.MAIN,
})
