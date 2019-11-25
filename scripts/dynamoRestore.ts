import './setupTestEnvironmentVariables'
import { UserEntity } from '../src/_common/database/entities/userEntity'
import { UserGroupRelationsEntity } from '../src/_common/database/entities/userGroupRelationEntity'
import * as fs from 'fs'
import * as path from 'path'
import { TableNames } from '../src/_common/database/tableNames'

const baseDir = path.join(process.cwd(), '.dynamodb/backup')
;(async () => {
  const fileMainTable = fs
    .readFileSync(`${baseDir}/${TableNames.MAIN}.json`)
    .toString()
  const fileRelationTable = fs
    .readFileSync(`${baseDir}/${TableNames.RELATIONS}.json`)
    .toString()

  const allEntititesFromMainTablePromise = UserEntity.batchPut(
    JSON.parse(fileMainTable)
  )
  const allEntitiesFromRelationTablePromise = UserGroupRelationsEntity.batchPut(
    JSON.parse(fileRelationTable)
  )

  await allEntititesFromMainTablePromise
  await allEntitiesFromRelationTablePromise
})()
