// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
const handle404 = (_req, _res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
}

export default handle404
