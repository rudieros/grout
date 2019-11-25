import './setupTestEnvironmentVariables'
import { UserEntity } from '../src/_common/database/entities/userEntity'
import { UserGroupRelationsEntity } from '../src/_common/database/entities/userGroupRelationEntity'
import * as fs from 'fs'
import * as path from 'path'
import { TableNames } from '../src/_common/database/tableNames'

const baseDir = path.join(process.cwd(), '.dynamodb/backup')

;(async () => {
  const allEntititesFromMainTablePromise = UserEntity.scan()
    .all()
    .exec()
  const allEntitiesFromRelationTablePromise = UserGroupRelationsEntity.scan()
    .all()
    .exec()

  const allEntititesFromMainTable = await allEntititesFromMainTablePromise
  const allEntitiesFromRelationTable = await allEntitiesFromRelationTablePromise

  fs.writeFileSync(
    `${baseDir}/${TableNames.MAIN}.json`,
    JSON.stringify(allEntititesFromMainTable)
  )
  fs.writeFileSync(
    `${baseDir}/${TableNames.RELATIONS}.json`,
    JSON.stringify(allEntitiesFromRelationTable)
  )
})()
