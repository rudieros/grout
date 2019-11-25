import { AuthPolicy } from './authorizerBlueprint'
import { AuthorizerConfig } from './models/AuthorizerConfig'

export interface CheckPublicRoutesInput {
  config: AuthorizerConfig
  awsAccountId: string
  apiOptions: any
  path: string
}

export const checkPublicRoutes = ({
  config,
  awsAccountId,
  apiOptions,
  path,
}: CheckPublicRoutesInput) => {
  const policy = new AuthPolicy('anonymous', awsAccountId, {
    ...apiOptions,
    stage: '*',
  })
  if (config.publicRoutes && config.publicRoutes.length) {
    const pathToRegexp = require('path-to-regexp')
    const calledPath = path
    const hasBasePathPath = process.env.IS_REMOTE === 'true'
    const resolvedRoute = config.publicRoutes.find((route) => {
      const pathToTest = pathToRegexp(
        `${hasBasePathPath ? `/${config.basePath}` : ''}/${route}`,
        []
      )
      const pathTestResult = pathToTest.exec(calledPath)
      return !!pathTestResult
    })
    if (resolvedRoute) {
      // create policy allowing access to every public route
      config.publicRoutes.forEach((publicRoute) => {
        policy.addMethod(
          'allow',
          '*',
          mapResourcePathStringToPolicy(publicRoute),
          null
        )
      })
      const builtPolicy = policy.build()
      return { policy: builtPolicy, resolvedPublicRoute: resolvedRoute }
    }
  }
  return {}
}

/**
 * This function takes a path param and replaces the params with a '*' char to be used
 * for AWS policies. (e.g '/users/:userId' becomes '/users/*')
 * @param method
 */
const mapResourcePathStringToPolicy = (method: string) => {
  return method
    .split('/')
    .map((pathElement: string) => {
      if (pathElement.charAt(0) === ':') {
        return '*'
      }
      return pathElement
    })
    .join('/')
}
