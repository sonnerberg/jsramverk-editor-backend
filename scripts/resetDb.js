import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import { schema } from '../src/db/schema.js'
dotenv.config()

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_CLUSTER_ADDRESS,
    DB_NAME_TEST,
    DB_NAME,
    DB_COLLECTION,
    NODE_ENV,
} = process.env

// Connection URI
let uri

if (NODE_ENV === 'production') {
    // Connection URI
    const username = encodeURIComponent(DB_USERNAME)
    const password = encodeURIComponent(DB_PASSWORD)
    uri = `mongodb+srv://${username}:${password}@${DB_CLUSTER_ADDRESS}/${DB_NAME}?retryWrites=true&w=majority`
} else if (NODE_ENV === 'test') {
    // uri = `mongodb://localhost:27017/${DB_NAME_TEST}`
    // Connection URI
    const username = encodeURIComponent(DB_USERNAME)
    const password = encodeURIComponent(DB_PASSWORD)
    uri = `mongodb+srv://${username}:${password}@${DB_CLUSTER_ADDRESS}/${DB_NAME_TEST}?retryWrites=true&w=majority`
} else {
    uri = `mongodb://localhost:27017/${DB_NAME}`
}
const database = {
    recreateDB: async () => {
        // Create a new MongoClient
        const client = new MongoClient(uri)
        // Connect the client to the server
        await client.connect()

        try {
            const db = client.db(DB_NAME)
            db.collection(DB_COLLECTION).drop((err, result) => {
                if (err) throw err
                if (result) console.log(`Collection successfully dropped`)
            })
            await db.createCollection(DB_COLLECTION, schema)
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close()
        }
    },
    recreateTestDB: async () => {
        // Create a new MongoClient
        const client = new MongoClient(uri)
        // Connect the client to the server
        await client.connect()

        try {
            const db = client.db(DB_NAME_TEST)
            db.collection(DB_COLLECTION).drop((err, result) => {
                if (err) throw err
                if (result) console.log(`Collection successfully dropped`)
            })
            await db.createCollection(DB_COLLECTION, schema)
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close()
        }
    },
}

if (NODE_ENV == 'test') {
    console.log('recreating test database')
    database.recreateTestDB()
} else if (NODE_ENV == 'production') {
    console.log('recreating production database')
    database.recreateDB()
} else {
    console.log('recreating local database')
    database.recreateDB()
}
