import { MainTableBaseSchema, MainTableDB } from '../mainTableBaseSchema'
import { CredentialProvider } from '@appsimples/os-heimdall/build/src'
import { db, Schema } from '../db'
import { TableNames } from '../tableNames'
import { DbEntities } from './_dbEntities'

export interface AuthDB extends MainTableDB {
  password: string
  provider: CredentialProvider
  userRole: string
  passwordRecoveryCode?: string
  facebookId?: string
  emailVerified: boolean
  emailConfirmationCode?: any
}

export const AuthSchema = new Schema(
  {
    ...MainTableBaseSchema,
    password: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      trim: true,
      required: true,
    },
    userRole: {
      type: String,
      trim: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    passwordRecoveryCode: {
      type: String,
      trim: true,
    },
    emailConfirmationCode: {
      type: String,
      trim: true,
    },
    facebookId: {
      type: String,
      trim: true,
    },
    entityName: {
      type: String,
      required: true,
      default: DbEntities.Auth,
      forceDefault: true,
    },
  },
  {
    timestamps: true,
  }
)

export const AuthEntity = db.model<AuthDB, MainTableDB>('Auth', AuthSchema, {
  tableName: TableNames.MAIN,
})
