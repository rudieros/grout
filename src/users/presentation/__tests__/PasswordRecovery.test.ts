import gql from 'graphql-tag'
import { createApolloTestClient } from '../../../_common/mocks/apolloServerMock'
import { ContainerInstance } from 'typedi'
import { EmailService } from '../../../_common/services/emailService'
import { RecoveryCodeGenerator } from '../../../_common/services/recoveryCodeGenerator'
import { PasswordRecoveryInput } from '../models/PasswordRecoveryInput'
import { MOCK_USERS_ME } from '../../../_common/mocks/databaseMockInjectors/injectUserMocks'
import { ErrorCodes } from '@appsimples/os-heimdall/build/src'
import { SignInInput } from '../models/SignInInput'
import { cleanAndLoadMockDataToTables } from '../../../../scripts/cleanAndLoadAllLocalDataToTables'

beforeEach(async () => {
  await cleanAndLoadMockDataToTables()
})

describe('password recovery', () => {
  jest.setTimeout(100000)
  const RECOVER_PASSWORD_MUTATION = gql`
    mutation RecoverPassword($input: PasswordRecoveryInput!) {
      passwordRecovery(input: $input) {
        message
      }
    }
  `
  it('should generate a new code for an existing user', async () => {
    const mockCode = '12345'
    const mockNewPassword = 'myNewPassword'
    const mockEmailService = {
      sendEmail: jest.fn(),
    }
    const { mutate } = createApolloTestClient({
      modifyContainer(container: ContainerInstance): void {
        container.set(EmailService, mockEmailService)
        container.set(RecoveryCodeGenerator, () => () => mockCode)
      },
    })
    let mockInput: PasswordRecoveryInput = {
      email: MOCK_USERS_ME.email,
    }
    const generateCodeResult = await mutate({
      mutation: RECOVER_PASSWORD_MUTATION,
      variables: { input: mockInput },
    })
    expect(mockEmailService.sendEmail).toHaveBeenCalled()
    expect(generateCodeResult.data).toBeDefined()

    mockInput = {
      code: 'invalid_mock_code',
      newPassword: mockNewPassword,
      email: MOCK_USERS_ME.email,
    }
    const wrongCodeResult = await mutate({
      mutation: RECOVER_PASSWORD_MUTATION,
      variables: { input: mockInput },
    })

    expect(wrongCodeResult.errors).toBeDefined()
    const hasErrorForWrongCode = wrongCodeResult.errors.some((error) => {
      return error.extensions.code === ErrorCodes.RECOVER_CODE_MISMATCH
    })
    expect(hasErrorForWrongCode).toBe(true)

    mockInput.code = mockCode
    const rightCodeInput = await mutate({
      mutation: RECOVER_PASSWORD_MUTATION,
      variables: { input: mockInput },
    })
    expect(rightCodeInput.data).toBeDefined()
    expect(rightCodeInput.errors).toBeUndefined()

    // sign in with new password and email
    const { query } = createApolloTestClient()
    const SIGN_IN = gql`
      mutation SignIn($input: SignInInput!) {
        result: signIn(signInInput: $input) {
          message
        }
      }
    `
    const signInInput: SignInInput = {
      authId: MOCK_USERS_ME.email,
      password: mockNewPassword,
    }
    const result = await query({
      query: SIGN_IN,
      variables: { input: signInInput },
    })
    expect(result.data).toBeDefined()
    expect(result.data.result).toBeDefined()
    expect(result.errors).not.toBeDefined()

    // check if user is signed in
    expect(result.extensions.authorization).toBeDefined()
    expect(result.extensions.authorization.token).toBeDefined()
    expect(result.extensions.authorization.uid).toBeDefined()
  })
})
