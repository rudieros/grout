import './setupTestEnvironmentVariables'
import { injectUserMocks } from '../src/_common/mocks/databaseMockInjectors/injectUserMocks'
import { cleanDynamoTables } from './cleanDynamoTables'

/**
 * Use this method only for mocks that will be used in automated tests
 */
export const syncTestMocksInDynamodb = async () => {
  await Promise.all([injectUserMocks()])
}

/**
 * Use this method to load data for local development and that should not be put into tests
 * For instance, data that was previously saved when running `yarn backup`
 */
export const syncExtraMocksInDynamoDb = async () => {
  // TODO
}

export const cleanAndLoadAllLocalDataToTables = async () => {
  await cleanDynamoTables()

  await syncTestMocksInDynamodb()
  await syncExtraMocksInDynamoDb()
}

export const cleanAndLoadMockDataToTables = async () => {
  await cleanDynamoTables()

  await syncTestMocksInDynamodb()
}
