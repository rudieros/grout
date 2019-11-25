import {
  fieldConfigEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity'
import { separateOperations } from 'graphql'
import { Config } from '../../../config'
import { ApolloError } from 'apollo-server-lambda'
import { ErrorCodes } from '../../../errorCodes'
import { schema } from '../schema'

export const queryComplexityPlugin = {
  requestDidStart: () => ({
    didResolveOperation({ request, document }: any) {
      /**
       * This provides GraphQL query analysis to be able to react on complex queries to your GraphQL server.
       * This can be used to protect your GraphQL servers against resource exhaustion and DoS attacks.
       * More documentation can be found at https://github.com/ivome/graphql-query-complexity.
       */
      const complexity = getComplexity({
        // our built schema
        schema,
        // to calculate query complexity properly,
        // we have to check if the document contains multiple operations
        // and eventually extract it operation from the whole query document.
        query: request.operationName
          ? separateOperations(document)[request.operationName]
          : document,
        // the variables for our GraphQL query
        variables: request.variables,
        // add any number of estimators. The estimators are invoked in order, the first
        // numeric value that is being returned by an estimator is used as the field complexity.
        // if no estimator returns a value, an exception is raised.
        estimators: [
          // using fieldConfigEstimator is mandatory to make it work with type-graphql.
          fieldConfigEstimator(),
          // add more estimators here...
          // this will assign each field a complexity of 1
          // if no other estimator returned a value.
          simpleEstimator({ defaultComplexity: 1 }),
        ],
      })
      // here we can react to the calculated complexity,
      // like compare it with max and throw error when the threshold is reached.
      const defaultMaxQueryComplexity = 10
      const maxQueryComplexity =
        Config.MaxQueryComplexity || defaultMaxQueryComplexity
      if (complexity > maxQueryComplexity) {
        throw new ApolloError(
          `Your query is too complex! Your query: ${complexity}, max complexity: ${maxQueryComplexity}.`,
          ErrorCodes.COMPLEX_QUERY
        )
      }
      // and here we can e.g. subtract the complexity point from hourly API calls limit.
      console.log('Used query complexity points:', complexity)
    },
  }),
}
