import 'source-map-support/register'
import 'reflect-metadata'
import './_common/database/db'
import { ResolverData } from 'type-graphql'
import { ApolloServer } from 'apollo-server-lambda'
import { Container } from 'typedi'
import { OSContext } from './context'
import * as path from 'path'
import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'
import { ErrorCodes } from './errorCodes'
import { queryComplexityPlugin } from './_common/graphql/plugins/queryComplexity'
import fetch from 'node-fetch'
import { schema } from './_common/graphql/schema'
import { ConfirmEmailUC } from './users/core/use-cases/ConfirmEmailUC'
import { Config } from './config'

// make fetch available globally
{
  ;(global as any).fetch = fetch
}

/**
 * Apollo Server
 */
export const server = new ApolloServer({
  schema,
  plugins: [queryComplexityPlugin],
  context: ({ event, context: lambdaContext }) => {
    const requestId = lambdaContext.awsRequestId
    const container = Container.of(requestId)
    const authorizerContent = event.requestContext.authorizer
    const graphQLContext: Partial<OSContext> = {
      uid: authorizerContent.uid,
      userRole: authorizerContent.userRole,
      requestId,
      container,
      authorizerContent,
    }
    return graphQLContext
  },
  formatResponse: (response: any, { context }: ResolverData<OSContext>) => {
    try {
      if (context.container.has('token')) {
        response.extensions = {
          authorization: {
            token: context.container.get('token'),
            uid: context.container.get('uid'),
          },
        }
      }
    } catch (err) {}
    // remember to dispose the scoped container to prevent memory leaks
    Container.reset(context.requestId)
    return response
  },
  formatError: (err) => {
    if (err.message.startsWith('Argument Validation Error')) {
      err.extensions.code = ErrorCodes.INPUT_VALIDATION_ERROR
    } else if (err.message.startsWith('Access denied')) {
      err.extensions.code = ErrorCodes.UNAUTHORIZED
    }
    return err
  },
})

/**
 * Express app for GraphIQL
 */
let graphiqlServer
if (process.env.NODE_ENV !== 'test') {
  const app = express()
  app.use('/docs', (req, res) => {
    res.sendFile(
      path.join(`${process.cwd()}/src/_common/graphql/graphiql.html`)
    )
  })
  app.use('/api', (req, res) => {
    const uc = new ConfirmEmailUC()
    console.log('Api Handled', req.query)
    uc.execute({ userId: req.query.i, code: req.query.c })
      .then((success) => {
        console.log('Api Handled 2', success)
        res
          // .status(301)
          // .header('Location', success ? Config.EmailConfirmSuccessPage : Config.EmailConfirmErrorPage)
          .redirect(
            success
              ? Config.EmailConfirmSuccessPage
              : Config.EmailConfirmErrorPage
          )
      })
      .catch((e) => {
        console.log('Error in API', e)
      })
  })
  graphiqlServer = awsServerlessExpress.createServer(app)
}

/**
 * Lambda Handler for the graphql API
 * @param e
 * @param context
 * @param calllback
 */
export const graphql = (e, context, calllback) => {
  server.createHandler({
    cors: {
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
    },
  })(e, context, calllback)
}

/**
 * Lambda Handler for the documentation website (graphiql)
 * @param e
 * @param context
 * @param calllback
 */
export const graphiql = (e, context, calllback) => {
  awsServerlessExpress.proxy(graphiqlServer, e, context)
}
