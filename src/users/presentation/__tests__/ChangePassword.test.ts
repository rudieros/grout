import { createApolloTestClient } from '../../../_common/mocks/apolloServerMock'
import { MOCK_USERS_ME } from '../../../_common/mocks/databaseMockInjectors/injectUserMocks'
import { UserRoles } from '../../../_common/authorization/UserRoles'
import gql from 'graphql-tag'
import { ChangePasswordInput } from '../models/ChangePasswordInput'
import { cleanAndLoadMockDataToTables } from '../../../../scripts/cleanAndLoadAllLocalDataToTables'

beforeEach(async () => {
  await cleanAndLoadMockDataToTables()
})

describe('changePassword', () => {
  const { mutate } = createApolloTestClient({
    uid: MOCK_USERS_ME.id,
    userRole: UserRoles.user,
  })
  test('`changePassword` should run,  password is correct', async () => {
    const ME = gql`
      mutation ChangePassword($input: ChangePasswordInput!) {
        changePassword(changePasswordInput: $input) {
          message
        }
      }
    `
    const input: ChangePasswordInput = {
      password: '123456',
      newPassword: '1234',
    }
    const result = await mutate({
      mutation: ME,
      variables: { input },
    })
    expect(result.data.changePassword.message).toBeDefined()
  })

  test('`changePassword` should not run, password is incorrect', async () => {
    const ME = gql`
      mutation ChangePassword($input: ChangePasswordInput!) {
        changePassword(changePasswordInput: $input) {
          message
        }
      }
    `
    const input: ChangePasswordInput = {
      password: '23456',
      newPassword: '123565',
    }
    const result = await mutate({
      mutation: ME,
      variables: { input },
    })
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.data).toBeNull()
  })
})
