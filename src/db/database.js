import dotenv from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb'
dotenv.config()

const { DB_USERNAME, DB_PASSWORD, DB_ADDRESS, DB_NAME, DB_COLLECTION } =
    process.env

// Connection URI
let uri
uri = `mongodb://localhost:27017/${DB_NAME}`

if (process.env.NODE_ENV === 'production') {
    // Connection URI
    const username = encodeURIComponent(DB_USERNAME)
    const password = encodeURIComponent(DB_PASSWORD)
    uri = `mongodb+srv://${username}:${password}@${DB_ADDRESS}/${DB_NAME}?retryWrites=true&w=majority`
}

const database = {
    getAllHTMLDocuments: async () => {
        // Create a new MongoClient
        const client = new MongoClient(uri)
        // Connect the client to the server
        await client.connect()

        try {
            const database = client.db(DB_NAME)
            const collection = database.collection(DB_COLLECTION)
            const query = {}

            const cursor = await collection.find(query).toArray()

            return cursor
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close()
        }
    },
    insertHTML: async (name, htmlToInsert) => {
        // Create a new MongoClient
        const client = new MongoClient(uri)
        // Connect the client to the server
        await client.connect()

        try {
            // Establish and verify connection
            await client.db(DB_NAME).command({ ping: 1 })
            console.log('Connected successfully to server')
            const database = client.db(DB_NAME)
            const collection = database.collection(DB_COLLECTION)
            const doc = {
                name,
                html: htmlToInsert,
            }
            const { insertedId: id } = await collection.insertOne(doc)
            return { message: `Successfully inserted document`, id }
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close()
        }
    },
    testConnection: async () => {
        // Create a new MongoClient
        const client = new MongoClient(uri)
        // Connect the client to the server
        await client.connect()

        try {
            // Establish and verify connection
            await client.db(DB_NAME).command({ ping: 1 })
            return 'Connected successfully to server'
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close()
        }
    },
    getOneDocument: async (id) => {
        // Create a new MongoClient
        const client = new MongoClient(uri)
        // Connect the client to the server
        await client.connect()

        try {
            const database = client.db(DB_NAME)
            const collection = database.collection(DB_COLLECTION)
            const query = { _id: ObjectId(id) }

            const doc = await collection.findOne(query)

            return doc
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close()
        }
    },
    updateDocument: async (id, html, name) => {
        // Create a new MongoClient
        const client = new MongoClient(uri)
        // Connect the client to the server
        await client.connect()

        try {
            console.log('html', id)
            const database = client.db(DB_NAME)
            const collection = database.collection(DB_COLLECTION)
            const query = { _id: ObjectId(id) }
            const update = {
                $set: {
                    html,
                    name,
                },
            }
            const options = { returnDocument: 'after' }

            const doc = await collection.findOneAndUpdate(
                query,
                update,
                options
            )

            return doc
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close()
        }
    },
}

export default database
