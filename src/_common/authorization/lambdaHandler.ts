import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda'
import {
  OSTokenModel,
  TokenGeneratorService,
} from '@appsimples/os-heimdall/build/src'
import { AuthPolicy } from 'os-bob/build'
import { AuthDB, AuthEntity } from '../database/entities/AuthEntity'
import { DbEntities } from '../database/entities/_dbEntities'

export type AuthorizerHandlerType = Handler

export const handler: AuthorizerHandlerType = async (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback
) => {
  const { apiOptions, awsAccountId } = getApiOptions(event)
  const token = event.headers.Authorization || event.headers.authorization
  // try to authenticate user
  const tokenService = new TokenGeneratorService()
  let tokenModel: Partial<OSTokenModel> = {}
  try {
    tokenModel =
      tokenService.getOSTokenModelFromToken(token, 'outsmartHash') || tokenModel
  } catch (e) {
    console.error('Error validating token', e)
  }
  const uid = tokenModel.userId

  const policy = new AuthPolicy(uid || 'anonymous', awsAccountId, apiOptions)
  policy.allowMethod('POST', '/graphql')
  policy.allowMethod('GET', '/docs')

  const authResponse = policy.build()
  const authorizerOutput = {
    uid,
    token,
    userRole: tokenModel.userRole,
  }
  authResponse.context = authorizerOutput
  return authResponse
}

const getApiOptions = (event: any) => {
  const apiOptions: any = {}
  const tmp = event.methodArn.split(':')
  const apiGatewayArnTmp = tmp[5].split('/')
  const awsAccountId = tmp[4]
  apiOptions.region = tmp[3]
  apiOptions.restApiId = apiGatewayArnTmp[0]
  apiOptions.stage = apiGatewayArnTmp[1]
  return { apiOptions, awsAccountId }
}
