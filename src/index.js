import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')) // 'combined' outputs the Apache style LOGs
}

const PORT = process.env.PORT || 1337

app.get('/', (_req, res) => {
    res.json({ hello: 'world' })
})

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((_req, _res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use(({ status, message: title }, _req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    res.status(status || 500).json({
        errors: [
            {
                status,
                title,
            },
        ],
    })
})

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`)
})
