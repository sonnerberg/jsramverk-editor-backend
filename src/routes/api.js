import express from 'express'
import database from '../db/database.js'
const router = express.Router()

router
    .post('/create', async ({ body: { html, name } }, res) => {
        try {
            const result = await database.insertHTML(name, html)
            return res.status(201).json({ data: result })
        } catch (errors) {
            return res.status(500).json({ errors: errors.message })
        }
    })
    .put('/update', async ({ body: { id, html, name } }, res, next) => {
        try {
            const result = await database.updateDocument(id, html, name)
            return res.status(200).json({ data: result })
        } catch (errors) {
            return res.status(500).json({ errors: errors.message })
        }
    })
    .get('/all', async (req, res, next) => {
        try {
            const result = await database.getAllHTMLDocuments()
            return res.status(200).json({ data: result })
        } catch (errors) {
            return res.status(500).json({ errors: errors.message })
        }
    })
    .get('/:id', async ({ params: { id } }, res, next) => {
        try {
            const result = await database.getOneDocument(id)
            return res.status(200).json({ data: result })
        } catch (errors) {
            return res.status(500).json({ errors: errors.message })
        }
    })

export default router
