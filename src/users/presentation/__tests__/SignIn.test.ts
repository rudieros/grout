import { createApolloTestClient } from '../../../_common/mocks/apolloServerMock'
import gql from 'graphql-tag'
import { SignInInput } from '../models/SignInInput'
import { MOCK_USERS_ME } from '../../../_common/mocks/databaseMockInjectors/injectUserMocks'
import { cleanAndLoadMockDataToTables } from '../../../../scripts/cleanAndLoadAllLocalDataToTables'

beforeEach(async () => {
  await cleanAndLoadMockDataToTables()
})

describe('signIn', () => {
  const { query } = createApolloTestClient()
  test('`signIn` should run, authId (email) and password are both correct', async () => {
    const ME = gql`
      mutation SignIn($input: SignInInput!) {
        signIn(signInInput: $input) {
          message
        }
      }
    `
    const input: SignInInput = {
      authId: MOCK_USERS_ME.email,
      password: '123456',
    }
    const result = await query({
      query: ME,
      variables: { input },
    })
    expect(result.data.signIn.message).toBeDefined()
    expect(result.extensions.authorization).toBeDefined()
    expect(result.extensions.authorization.token).toBeDefined()
    expect(result.extensions.authorization.uid).toBeDefined()
  })

  test('`signIn` should run, authId (userName) and password are both correct', async () => {
    const ME = gql`
      mutation SignIn($input: SignInInput!) {
        signIn(signInInput: $input) {
          message
        }
      }
    `
    const input: SignInInput = {
      authId: MOCK_USERS_ME.userName,
      password: '123456',
    }
    const result = await query({
      query: ME,
      variables: { input },
    })
    expect(result.data.signIn.message).toBeDefined()
    expect(result.extensions.authorization).toBeDefined()
    expect(result.extensions.authorization.token).toBeDefined()
    expect(result.extensions.authorization.uid).toBeDefined()
  })

  test('`signIn` should fail, userName is correct, but the password is incorrect', async () => {
    const ME = gql`
      mutation SignIn($input: SignInInput!) {
        signIn(signInInput: $input) {
          message
        }
      }
    `
    const input: SignInInput = {
      authId: MOCK_USERS_ME.userName,
      password: '123',
    }
    const result = await query({
      query: ME,
      variables: { input },
    })
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.data).toBeNull()
  })

  test('`signIn` should fail, userName is incorrect, but the password is correct', async () => {
    const ME = gql`
      mutation SignIn($input: SignInInput!) {
        signIn(signInInput: $input) {
          message
        }
      }
    `
    const input: SignInInput = {
      authId: MOCK_USERS_ME.name,
      password: '123456',
    }
    const result = await query({
      query: ME,
      variables: { input },
    })
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.data).toBeNull()
  })
})
