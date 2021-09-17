import express from 'express'
import database from '../db/database.js'
const router = express.Router()

const returnError = (res, errors) =>
    res.status(500).json({ errors: { message: errors.message, errors } })

const returnSuccess = (res, result, status) =>
    res.status(status).json({ data: result })

router
    .post('/create', async ({ body: { html, name } }, res, _next) => {
        try {
            const result = await database.insertHTML(name, html)
            return returnSuccess(res, result, 201)
        } catch (errors) {
            return returnError(res, errors)
        }
    })
    .put('/update', async ({ body: { id, html, name } }, res, _next) => {
        try {
            const result = await database.updateDocument(id, html, name)
            return returnSuccess(res, result, 200)
        } catch (errors) {
            return returnError(res, errors)
        }
    })
    .get('/', async (_req, res, _next) => {
        try {
            const result = await database.getAllHTMLDocuments()
            return returnSuccess(res, result, 200)
        } catch (errors) {
            return returnError(res, errors)
        }
    })
    .get('/:id', async ({ params: { id } }, res, _next) => {
        try {
            const result = await database.getOneDocument(id)
            return returnSuccess(res, result, 200)
        } catch (errors) {
            return returnError(res, errors)
        }
    })

export default router
