import { MainTableBaseSchema, MainTableDB } from '../mainTableBaseSchema'
import { db, Schema } from '../db'
import { TableNames } from '../tableNames'
import {
  DatabasePicture,
  DatabasePictureSchema,
} from '../models/databasePicture'
import { DbEntities } from './_dbEntities'
import { UserGender } from '../../models/UserGender'

export interface UserDB extends MainTableDB {
  name: string
  userName: string
  email: string
  dateOfBirth: Date
  gender: UserGender
  password?: string
  profilePicture?: DatabasePicture
  favLocationId: string
  currentSubscriptionPlanId: string
}

export const UserSchema = new Schema(
  {
    ...MainTableBaseSchema,
    name: {
      type: String,
      trim: true,
      required: true,
    },
    userName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(UserGender),
      required: true,
    },
    favLocationId: {
      type: String,
      required: true,
    },
    currentSubscriptionPlanId: {
      type: String,
      required: true,
    },
    profilePicture: DatabasePictureSchema,
    entityName: {
      type: String,
      required: true,
      default: DbEntities.User,
      forceDefault: true,
    },
  },
  {
    timestamps: true,
    useDocumentTypes: true,
  }
)

export const UserEntity = db.model<UserDB, MainTableDB>('User', UserSchema, {
  tableName: TableNames.MAIN,
})
