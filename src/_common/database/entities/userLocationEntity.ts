import { MainTableBaseSchema, MainTableDB } from '../mainTableBaseSchema'
import { db, Schema } from '../db'
import { TableNames } from '../tableNames'
import {
  DatabasePicture,
  DatabasePictureSchema,
} from '../models/databasePicture'
import { DbEntities } from './_dbEntities'
import { UserGender } from '../../models/UserGender'

export interface LocationDB extends MainTableDB {
  lat: number
  lon: number
  nickName: string
}

export const LocationSchema = new Schema(
  {
    ...MainTableBaseSchema,
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    nickName: {
      type: String,
      required: true,
    },
    entityName: {
      type: String,
      required: true,
      default: DbEntities.Location,
    },
  },
  {
    timestamps: true,
    useDocumentTypes: true,
  }
)

export const LocationEntity = db.model<LocationDB, MainTableDB>(
  'Location',
  LocationSchema,
  {
    tableName: TableNames.MAIN,
  }
)
