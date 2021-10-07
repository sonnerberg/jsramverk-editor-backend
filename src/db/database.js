import dotenv from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb'
dotenv.config()

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_CLUSTER_ADDRESS,
    DB_NAME,
    DB_COLLECTION,
    DB_NAME_TEST,
} = process.env

// Connection URI
let uri
let username
let password

console.log(
    'Github actions should be able to read this:',
    process.env.TEST_ENVIRONMENT
)

if (process.env.NODE_ENV === 'production') {
    // Connection URI
    username = encodeURIComponent(DB_USERNAME)
    password = encodeURIComponent(DB_PASSWORD)
    uri = `mongodb+srv://${username}:${password}@${DB_CLUSTER_ADDRESS}/${DB_NAME}?retryWrites=true&w=majority`
} else if (process.env.NODE_ENV === 'test') {
    // uri = `mongodb://localhost:27017/${DB_NAME_TEST}`
    // Connection URI
    username = encodeURIComponent(DB_USERNAME)
    password = encodeURIComponent(DB_PASSWORD)
    uri = `mongodb+srv://${username}:${password}@${DB_CLUSTER_ADDRESS}/${DB_NAME_TEST}?retryWrites=true&w=majority`
} else {
    uri = `mongodb://localhost:27017/${DB_NAME}`
}

const database = {
    getAllHTMLDocuments: async () => {
        // Create a new MongoClient
        const client = new MongoClient(uri)
        // Connect the client to the server
        await client.connect()

        try {
            const database =
                process.env.NODE_ENV === 'test'
                    ? client.db(DB_NAME_TEST)
                    : client.db(DB_NAME)
            const collection = database.collection(DB_COLLECTION)
            const query = {}

            const docs = await collection.find(query).toArray()

            return docs
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
            const database =
                process.env.NODE_ENV === 'test'
                    ? client.db(DB_NAME_TEST)
                    : client.db(DB_NAME)
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
            const database =
                process.env.NODE_ENV === 'test'
                    ? client.db(DB_NAME_TEST)
                    : client.db(DB_NAME)
            const collection = database.collection(DB_COLLECTION)
            const query = { _id: ObjectId(id) }

            const doc = await collection.findOne(query)

            if (!doc) throw new Error('Document not found')

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
            const database =
                process.env.NODE_ENV === 'test'
                    ? client.db(DB_NAME_TEST)
                    : client.db(DB_NAME)
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
