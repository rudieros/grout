// returns a standard Node.js HTTP server
import { cleanAndLoadAllLocalDataToTables } from './cleanAndLoadAllLocalDataToTables'

// tslint:disable-next-line:one-variable-per-declaration
const dynalite = require('dynalite'),
  dynaliteServer = dynalite({ path: '.dynamodb', createTableMs: 50 })

// listen on port 4567
dynaliteServer.listen(8000, async function(err) {
  if (err) {
    throw err
  }
  await cleanAndLoadAllLocalDataToTables()
  console.log('Dynalite started on port 8000')
})
