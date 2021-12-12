import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
// import path from 'path'
import expressSession from 'express-session'

import { createServer } from 'http'
import { Server } from 'socket.io'
import { ensureLoggedIn } from 'connect-ensure-login'

import handle404 from './handle404.js'
import errorHandler from './errorHandler.js'
import database from './db/database.js'
import passport from './passport.js'
import { authRouter } from './routes/authRouter.js'
import { apiRouter } from './routes/apiRouter.js'
import { getFrontendURL } from './getFrontendURL.js'
import { usersRouter } from './routes/usersRouter.js'

const { NODE_ENV, SESSION_SECRET } = process.env
let { PORT } = process.env

// const __dirname = path.resolve()
// const rootRouter = express.Router()

PORT = PORT || 1337

const app = express()

// don't show the log when it is test
if (NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')) // 'combined' outputs the Apache style LOGs
}

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use(
    expressSession({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
)

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize())
app.use(passport.session())

// app.use('/api/v1', apiRouter)
app.use('/api/v1', ensureLoggedIn(), apiRouter)

app.use('/auth/v1', authRouter)
app.use('/users/v1', usersRouter)

// const buildPath = path.normalize(path.join(__dirname, 'public', 'build'))

// app.use(express.static(buildPath))

// rootRouter.get('(/*)?', async (_req, res, _next) => {
//     res.sendFile(path.join(buildPath, 'index.html'))
// })

// app.use(rootRouter)

app.use(handle404)
app.use(errorHandler)

const httpServer = createServer(app)

const corsConfig = {
    cors: {
        origin: getFrontendURL(),
        methods: ['GET', 'POST'],
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
                    await database.documents.updateDocument({
                        id: data.id,
                        html: data.editorText,
                        name: data.name,
                    })
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
