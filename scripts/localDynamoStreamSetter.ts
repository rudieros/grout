import * as AWS from 'aws-sdk'

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
import '../src/_common/database/db'

import { TableNames } from '../src/_common/database/tableNames'
const dynamodb = new AWS.DynamoDB()

async function exec() {
  const description = await dynamodb
    .describeTable({
      TableName: TableNames.MAIN,
    })
    .promise()
  console.log('Description', description.Table.LatestStreamArn)
}

exec()
