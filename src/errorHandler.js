const errorHandler = ({ status, message: title }, _req, res, next) => {
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
}

export default errorHandler
