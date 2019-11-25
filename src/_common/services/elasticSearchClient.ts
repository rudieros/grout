import * as AWS from 'aws-sdk'
import { Client } from 'elasticsearch'
import { Config } from '../../config'

export const elasticsearch = new Client({
  host: Config.ElasticSearchDomain,
  // tslint:disable-next-line:no-require-imports
  connectionClass: require('http-aws-es'),
  awsConfig: new AWS.Config({ region: process.env.AWS_REGION }),
  amazonES: {
    region: process.env.AWS_REGION,
    credentials: new AWS.Credentials(
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_ACCESS_KEY_ID
    ),
  },
  apiVersion: '6.8',
} as any)
