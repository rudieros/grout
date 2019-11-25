import '../scripts/setupTestEnvironmentVariables'
import { launchLocalDynamoDb } from '../scripts/launchLocalDynamodb'
import { syncTestMocksInDynamodb } from '../scripts/cleanAndLoadAllLocalDataToTables'
import { cleanDynamoTables } from '../scripts/cleanDynamoTables'

module.exports = async () => {
  await launchLocalDynamoDb().catch(console.error)
  await cleanDynamoTables()
  await syncTestMocksInDynamodb()
}
