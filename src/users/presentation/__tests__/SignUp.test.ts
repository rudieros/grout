import { SignUpInput } from '../models/SignUpInput'
import { UserGender } from '../../../_common/models/UserGender'
import gql from 'graphql-tag'
import { createApolloTestClient } from '../../../_common/mocks/apolloServerMock'
import { cleanAndLoadMockDataToTables } from '../../../../scripts/cleanAndLoadAllLocalDataToTables'

beforeEach(async () => {
  await cleanAndLoadMockDataToTables()
})

describe('signUp', () => {
  it('should create my user successfully and return me when querying `me`!', async () => {
    const mockUser: SignUpInput = {
      name: 'Olenna Tyrell',
      userName: 'oleninhaOldSchool',
      email: 'olenna@tyrell.com',
      dateOfBirth: 0,
      gender: UserGender.female,
      currentCity: 'São Paulo',
      country: 'br',
      googlePlaceId: 'dkjsahdjaks',
      password: '1234567@',
    }
    const SIGN_UP_MUTATION = gql`
      mutation SignUp($user: SignUpInput!) {
        user: signUp(user: $user) {
          id
          name
        }
      }
    `
    const { mutate } = createApolloTestClient()
    const result = await mutate({
      mutation: SIGN_UP_MUTATION,
      variables: {
        user: mockUser,
      },
    })
    expect(result.data).toBeDefined()
    const user = result.data.user
    expect(user.name).toBe(mockUser.name)
    // check if user is signed in
    expect(result.extensions.authorization).toBeDefined()
    expect(result.extensions.authorization.token).toBeDefined()
    expect(result.extensions.authorization.uid).toBeDefined()
  })

  it('should not create my user, password format is incorrect', async () => {
    const mockUser: SignUpInput = {
      name: 'Olenna Tyrell',
      userName: 'oleninhaOldSchool',
      email: 'olenna@tyrell.com',
      dateOfBirth: 0,
      gender: UserGender.female,
      currentCity: 'São Paulo',
      country: 'br',
      googlePlaceId: 'dkjsahdjaks',
      password: '12345aaa',
    }
    const SIGN_UP_MUTATION = gql`
      mutation SignUp($user: SignUpInput!) {
        user: signUp(user: $user) {
          id
          name
        }
      }
    `
    const { mutate } = createApolloTestClient()
    const result = await mutate({
      mutation: SIGN_UP_MUTATION,
      variables: {
        user: mockUser,
      },
    })
    expect(result.data).toBeNull()
    expect(result.errors.length).toBeGreaterThan(0)
  })
})
