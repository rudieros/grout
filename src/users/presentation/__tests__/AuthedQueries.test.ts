import { createApolloTestClient } from '../../../_common/mocks/apolloServerMock'
import { MOCK_USERS_ME } from '../../../_common/mocks/databaseMockInjectors/injectUserMocks'
import { UserRoles } from '../../../_common/authorization/UserRoles'
import gql from 'graphql-tag'
import { cleanAndLoadMockDataToTables } from '../../../../scripts/cleanAndLoadAllLocalDataToTables'

beforeEach(async () => {
  await cleanAndLoadMockDataToTables()
})

describe('Authed Queries', () => {
  const { query } = createApolloTestClient({
    uid: MOCK_USERS_ME.id,
    userRole: UserRoles.user,
  })
  test('`me` should return logged user successfully', async () => {
    const ME = gql`
      query {
        me {
          id
          name
        }
      }
    `
    const result = await query({
      query: ME,
    })
    expect(result.data).toBeDefined()
    expect(result.data.me.id).toBe(MOCK_USERS_ME.id)
    expect(result.data.me.name).toBe(MOCK_USERS_ME.name)
    expect(result.data.me).toMatchSnapshot()
  })
  test('`me` should return logged user unsuccessfully', async () => {
    const ME = gql`
      query {
        me {
          id
        }
      }
    `
    const result = await query({
      query: ME,
    })
  })
})
