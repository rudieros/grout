import 'reflect-metadata'
import './setupTestEnvironmentVariables'
import { printSchema } from 'graphql'
import * as fs from 'fs'
import * as path from 'path'
import { schema } from '../src/_common/graphql/schema'

{
  ;(async () => {
    const sdl = printSchema(schema)
    fs.writeFileSync(path.join(process.cwd(), 'schema.graphql'), sdl)
  })()
}
