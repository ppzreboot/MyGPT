import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri)
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')

const options = { appName: 'MyGPT' }

let client: MongoClient

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient
  }

  if (!globalWithMongo._mongoClient)
    globalWithMongo._mongoClient = new MongoClient(uri, options)

  client = globalWithMongo._mongoClient
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
}

export
const mongo_db = client.db('MyGPT')
