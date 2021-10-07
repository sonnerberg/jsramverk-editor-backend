import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import apiRouter from './routes/api.js'
// import handle404 from './handle404.js'
// import errorHandler from './errorHandler.js'
import path from 'path'

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

export const server = app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`)
})
