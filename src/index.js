import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import apiRouter from './routes/api.js'
// import handle404 from './handle404.js'
// import errorHandler from './errorHandler.js'
import path from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'
import database from './db/database.js'

const __dirname = path.resolve()
const rootRouter = express.Router()

const PORT = process.env.PORT || 1337

const app = express()

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')) // 'combined' outputs the Apache style LOGs
}

app.use(cors())
app.use(express.json())

app.use('/api/v1', apiRouter)

const buildPath = path.normalize(path.join(__dirname, 'public', 'build'))

app.use(express.static(buildPath))

rootRouter.get('(/*)?', async (_req, res, _next) => {
    res.sendFile(path.join(buildPath, 'index.html'))
})

app.use(rootRouter)

// app.use(handle404)
// app.use(errorHandler)

const httpServer = createServer(app)

const corsConfig = {
    cors: {
        origin:
            process.env.NODE_ENV === 'production'
                ? // [
                  'https://www.student.bth.se'
                : //   'https://jsramverk-editor-pene14.azurewebsites.net/',
                  //   ]
                  'http://localhost:3000',
        methods: ['GET', 'POST'],
        // allowedHeaders: ['Access-Control-Allow-Origin'],
    },
}

const io = new Server(httpServer, corsConfig)

io.sockets.on('connection', (socket) => {
    socket.on('join', ({ room }) => {
        console.log(`joining room: ${room} from ${socket.id}`)
        socket.join(room)
    })

    socket.on('leave', ({ room }) => {
        console.log(`leaving room: ${room} from ${socket.id}`)
        socket.leave(room)
    })

    socket.on('newDocument', ({ id }) => {
        console.log('new document created')
        socket.broadcast.emit('newDocument', { id })
    })

    let previousData

    socket.on('doc', async (data) => {
        if (JSON.stringify(previousData) !== JSON.stringify(data)) {
            console.log(`sending data to room: ${data.id} from ${socket.id}`)
            if (data.id) {
                socket.to(data.id).emit('doc', data)
                try {
                    await database.updateDocument(
                        data.id,
                        data.editorText,
                        data.name
                    )
                } catch (error) {
                    console.error(error.message)
                }
            }
        }
        previousData = data
    })
})

export const server = httpServer.listen(PORT, () => {
    console.log(`server listening on ${PORT}`)
})
