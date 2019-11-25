/**
 * Load arg info TODO: add elasticsearch stuff
 */
if (process.argv.includes('--exec')) {
  const envConfig = process.argv.find((arg) => arg.includes('env='))
  if (envConfig) {
    const environment = envConfig.split('=')[1]
    const path = require('path')
    require('dotenv').config({
      path: path.join(__dirname, `../.env.${environment}`),
    })
  }
}

import { UserEntity } from '../src/_common/database/entities/userEntity'
import { UserUserRelationEntity } from '../src/_common/database/entities/userUserRelationEntity'

/**
 * Clean all dynamo tables
 */
export const cleanDynamoTables = async () => {
  const allResultsMainTable = await UserEntity.scan()
    .all()
    .exec()
  console.log('Has results', allResultsMainTable.length)
  await UserEntity.batchDelete(allResultsMainTable as any).catch((err) => {
    console.log('Error cleaning table', err)
  })

  const allResultsRelationsTable = await UserUserRelationEntity.scan()
    .all()
    .exec()
  await UserUserRelationEntity.batchDelete(
    allResultsRelationsTable as any
  ).catch((err) => {
    console.log('Error cleaning table', err)
  })
}

if (process.argv.includes('--exec')) {
  cleanDynamoTables()
}
