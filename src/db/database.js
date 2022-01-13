import dotenv from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb'
import { hashPassword } from './hashing.js'
dotenv.config()

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_CLUSTER_ADDRESS,
    DB_NAME,
    DB_USERS_COLLECTION,
    DB_NAME_TEST,
    NODE_ENV,
} = process.env

// Connection URI
let uri
let username
let password

if (NODE_ENV === 'production') {
    // Connection URI
    username = encodeURIComponent(DB_USERNAME)
    password = encodeURIComponent(DB_PASSWORD)
    uri = `mongodb+srv://${username}:${password}@${DB_CLUSTER_ADDRESS}/${DB_NAME}?retryWrites=true&w=majority`
} else if (NODE_ENV === 'test') {
    // uri = `mongodb://localhost:27017/${DB_NAME_TEST}`
    // Connection URI
    username = encodeURIComponent(DB_USERNAME)
    password = encodeURIComponent(DB_PASSWORD)
    uri = `mongodb+srv://${username}:${password}@${DB_CLUSTER_ADDRESS}/${DB_NAME_TEST}?retryWrites=true&w=majority`
} else {
    uri = `mongodb://localhost:27017/${DB_NAME}`
}

async function getDatabase(client) {
    return NODE_ENV === 'test' ? client.db(DB_NAME_TEST) : client.db(DB_NAME)
}

const database = {
    users: {
        allowUserToEditDocument: async ({
            emailOfLoggedInUser,
            documentToEditId,
            userWhoShouldEditId,
        }) => {
            // Create a new MongoClient
            const client = new MongoClient(uri)
            // Connect the client to the server
            await client.connect()

            try {
                const database = await getDatabase(client)
                const collection = database.collection(DB_USERS_COLLECTION)
                const queryUserWhoShouldBeAbleToEdit = {
                    _id: ObjectId(userWhoShouldEditId),
                }

                const userWhoShouldBeAbleToEdit = await collection.findOne(
                    queryUserWhoShouldBeAbleToEdit,
                    { _id: 1 }
                )

                // TODO: Make this error a 404
                if (!userWhoShouldBeAbleToEdit)
                    throw new Error('The user who should edit does not exist')

                const queryUserWhoIsLoggedIn = { email: emailOfLoggedInUser }

                const userWhoIsLoggedInAndOwnerOfDocument =
                    await collection.findOne(queryUserWhoIsLoggedIn, { _id: 1 })

                if (
                    userWhoShouldBeAbleToEdit._id ===
                    userWhoIsLoggedInAndOwnerOfDocument._id
                ) {
                    throw new Error(
                        'The user who should edit is the same as the user who owns the document'
                    )
                }

                const queryUserWhoIsLoggedInAndOwnerOfDocument = {
                    email: emailOfLoggedInUser,
                    'docs._id': ObjectId(documentToEditId),
                }

                // https://stackoverflow.com/a/24114068
                const update = {
                    $addToSet: {
                        'docs.$.allowedUsers': ObjectId(userWhoShouldEditId),
                    },
                }
                const options = {
                    returnDocument: 'after',
                    projection: {
                        'docs.allowedUsers': 1,
                        'docs._id': 1,
                        'docs.name': 1,
                        'docs.text': 1,
                    },
                }

                const doc = await collection.findOneAndUpdate(
                    queryUserWhoIsLoggedInAndOwnerOfDocument,
                    update,
                    options
                )

                // TODO: Make this error a 404
                if (!doc.lastErrorObject.updatedExisting)
                    throw new Error('Document not found')

                const updatedDocument = doc.value.docs.find(
                    (doc) =>
                        JSON.stringify(doc._id) ===
                        JSON.stringify(ObjectId(documentToEditId))
                )

                return updatedDocument
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close()
            }
        },
        registerUser: async ({ email, password }) => {
            // Create a new MongoClient
            const client = new MongoClient(uri)
            // Connect the client to the server
            await client.connect()

            try {
                if (password.length < 5)
                    throw new Error(
                        'Password has to be at least 5 characters long.'
                    )
                const hashedPassword = await hashPassword(password)
                const database = await getDatabase(client)
                const collection = database.collection(DB_USERS_COLLECTION)
                const doc = {
                    email,
                    password: hashedPassword,
                }
                const { insertedId: id } = await collection.insertOne(doc)
                return { message: `Successfully inserted user`, id }
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close()
            }
        },
        registerUserWithRandomPassword: async ({ username }) => {
            // Create a new MongoClient
            const client = new MongoClient(uri)
            // Connect the client to the server
            await client.connect()

            // TODO: Generate password with crypto
            const somePassword = 'hellko'

            try {
                const database = await getDatabase(client)
                const collection = database.collection(DB_USERS_COLLECTION)

                const hashedPassword = await hashPassword(somePassword)

                const doc = {
                    email: username,
                    password: hashedPassword,
                }
                const { insertedId: id } = await collection.insertOne(doc)
                return { message: `Successfully inserted user`, id }
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close()
            }
        },
        findOne: async ({ username }) => {
            // Create a new MongoClient
            const client = new MongoClient(uri)
            // Connect the client to the server
            await client.connect()

            try {
                const database = await getDatabase(client)
                const collection = database.collection(DB_USERS_COLLECTION)
                const query = { email: username }
                const projection = { password: 1, _id: 0 }

                const doc = await collection.findOne(query, projection)

                // if (!doc) throw new Error('User not found')

                return doc
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close()
            }
        },
        getAllUsers: async ({ email }) => {
            // Create a new MongoClient
            const client = new MongoClient(uri)
            // Connect the client to the server
            await client.connect()

            try {
                const database = await getDatabase(client)
                const collection = database.collection(DB_USERS_COLLECTION)
                const match = { $match: { email: { $not: { $eq: email } } } }
                const projection = { $project: { email: 1 } }

                const pipeline = email ? [match, projection] : [projection]

                const docs = await collection.aggregate(pipeline).toArray()

                return docs
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close()
            }
        },
    },
    documents: {
        getAllHTMLDocuments: async ({ email }) => {
            // Create a new MongoClient
            const client = new MongoClient(uri)
            // Connect the client to the server
            await client.connect()

            try {
                const database = await getDatabase(client)
                const collection = database.collection(DB_USERS_COLLECTION)
                const query = { email }
                const options = { projection: { _id: 1 } }

                const user = await collection.findOne(query, options)

                const pipeline = [
                    { $unwind: '$docs' },
                    {
                        $match: {
                            $or: [
                                { _id: ObjectId(user._id) },
                                {
                                    'docs.allowedUsers': ObjectId(user._id),
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            name: '$docs.name',
                            text: '$docs.text',
                            _id: '$docs._id',
                            allowedUsers: '$docs.allowedUsers',
                        },
                    },
                    { $project: { name: 1, text: 1, _id: 1, allowedUsers: 1 } },
                ]

                const returnedDocuments = await collection
                    .aggregate(pipeline)
                    .toArray()

                if (returnedDocuments) return returnedDocuments

                return []
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close()
            }
        },
        insertHTML: async (name, htmlToInsert, email) => {
            // Create a new MongoClient
            const client = new MongoClient(uri)
            // Connect the client to the server
            await client.connect()

            try {
                if (!name || !htmlToInsert)
                    throw Error('name or text is missing')
                const database = await getDatabase(client)
                const collection = database.collection(DB_USERS_COLLECTION)
                const user = await collection.findOne({ email })
                const query = { _id: ObjectId(user._id) }
                const update = {
                    $push: {
                        docs: {
                            _id: ObjectId(),
                            name,
                            text: htmlToInsert,
                        },
                    },
                }
                const options = { returnDocument: 'after' }

                const doc = await collection.findOneAndUpdate(
                    query,
                    update,
                    options
                )

                const insertedDocument =
                    doc.value.docs[doc.value.docs.length - 1]

                return {
                    // message: `Successfully inserted document`,
                    _id: insertedDocument._id,
                    name: insertedDocument.name,
                    text: insertedDocument.text,
                }
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close()
            }
        },
        getOneDocument: async ({ email, id }) => {
            // Create a new MongoClient
            const client = new MongoClient(uri)
            // Connect the client to the server
            await client.connect()

            try {
                const database = await getDatabase(client)
                const collection = database.collection(DB_USERS_COLLECTION)

                const query = { email }
                const options = { projection: { _id: 1 } }

                const user = await collection.findOne(query, options)

                const pipeline = [
                    { $unwind: '$docs' },
                    {
                        $match: {
                            $or: [
                                { _id: ObjectId(user._id) },
                                {
                                    'docs.allowedUsers': ObjectId(user._id),
                                },
                            ],
                        },
                    },
                    {
                        $match: {
                            'docs._id': {
                                $eq: ObjectId(id),
                            },
                        },
                    },
                    {
                        $addFields: {
                            _id: '$docs._id',
                            name: '$docs.name',
                            text: '$docs.text',
                        },
                    },
                    { $project: { name: 1, text: 1 } },
                ]

                const doc = await collection.aggregate(pipeline).toArray()

                if (Array.isArray(doc) && !doc.length)
                    throw new Error('Document not found')

                return doc[0]
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close()
            }
        },
        updateDocument: async ({ id: documentId, html: text, name, email }) => {
            // Create a new MongoClient
            const client = new MongoClient(uri)
            // Connect the client to the server
            await client.connect()

            try {
                const database = await getDatabase(client)
                const collection = database.collection(DB_USERS_COLLECTION)
                const queryUser = { email }
                const optionsUser = { projection: { _id: 1 } }

                const { _id: userId } = await collection.findOne(
                    queryUser,
                    optionsUser
                )
                const pipeline = [
                    {
                        $match: {
                            'docs._id': ObjectId(documentId),
                        },
                    },
                    {
                        $match: {
                            $or: [
                                { _id: ObjectId(userId) },
                                {
                                    'docs.allowedUsers': ObjectId(userId),
                                },
                            ],
                        },
                    },
                ]
                const userIsAllowedToEdit = await collection
                    .aggregate(pipeline)
                    .toArray()

                if (
                    Array.isArray(userIsAllowedToEdit) &&
                    !userIsAllowedToEdit.length
                ) {
                    throw new Error('User is not allowed to edit this document')
                }
                const query = { 'docs._id': ObjectId(documentId) }
                const update = {
                    $set: {
                        'docs.$.text': text,
                        'docs.$.name': name,
                    },
                }
                const options = { returnDocument: 'after', project: { _id: 1 } }

                const doc = await collection.findOneAndUpdate(
                    query,
                    update,
                    options
                )

                return doc.value.docs.find(
                    (doc) =>
                        JSON.stringify(doc._id) ===
                        JSON.stringify(ObjectId(documentId))
                )
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close()
            }
        },
    },
}

export default database
