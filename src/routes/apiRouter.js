import express from 'express'
import database from '../db/database.js'
export const apiRouter = express.Router()

const returnError = (res, errors) =>
    res.status(500).json({ errors: { message: errors.message, errors } })

const returnSuccess = (res, result, status) =>
    res.status(status).json({ data: result })

apiRouter
    .post('/create', async (req, res, _next) => {
        const {
            body: { html, name },
        } = req
        const { email } = req.user
        try {
            const result = await database.documents.insertHTML(
                name,
                html,
                email
            )
            return returnSuccess(res, result, 201)
        } catch (errors) {
            return returnError(res, errors)
        }
    })
    .put('/update', async (req, res, _next) => {
        try {
            const { id, html, name } = req.body
            const { email } = req.user
            const result = await database.documents.updateDocument({
                id,
                html,
                name,
                email,
            })
            return returnSuccess(res, result, 200)
        } catch (errors) {
            return returnError(res, errors)
        }
    })
    .get('/', async (req, res, _next) => {
        try {
            const { email } = req.user
            const result = await database.documents.getAllHTMLDocuments({
                email,
            })
            return returnSuccess(res, result, 200)
        } catch (errors) {
            return returnError(res, errors)
        }
    })
    .get('/:id', async ({ params: { id }, user: { email } }, res, _next) => {
        try {
            const result = await database.documents.getOneDocument({
                id,
                email,
            })
            return returnSuccess(res, result, 200)
        } catch (errors) {
            return returnError(res, errors)
        }
    })
