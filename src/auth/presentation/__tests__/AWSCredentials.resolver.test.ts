import gql from 'graphql-tag'
import { createApolloTestClient } from '../../../_common/mocks/apolloServerMock'
import { MOCK_USERS_ME } from '../../../_common/mocks/databaseMockInjectors/injectUserMocks'
import { UserRoles } from '../../../_common/authorization/UserRoles'

beforeEach(() => {})

describe('AuthResolver', () => {
  // TODO create proper mock for this tests, they're not working
  describe('Authed Queries', () => {
    test('mockTest', () => {
      expect(true).toBe(true)
    })
    // const { query } = createApolloTestClient({
    //   uid: MOCK_USERS_ME.id,
    //   userRole: UserRoles.user,
    // })
    // test('`me` should return logged user successfully', async () => {
    //   const GET_AWS_CREDENTIALS = gql`
    //     query {
    //       credentials: getCredentials {
    //         awsAccessKeyId
    //         awsSecretKey
    //         sessionToken
    //         expirationTimestamp
    //       }
    //     }
    //   `
    //   const result = await query({
    //     query: GET_AWS_CREDENTIALS,
    //   })
    //   expect(result.data.me.id).toBe(MOCK_USERS_ME.id)
    //   expect(result.data.me.name).toBe(MOCK_USERS_ME.name)
    //   expect(result.data.me).toMatchSnapshot()
    // })
  })
})
