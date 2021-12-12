import express from 'express'
import passport from '../passport.js'
import database from '../db/database.js'
export const usersRouter = express.Router()

const returnError = (res, errors) =>
    res.status(500).json({ errors: { message: errors.message, errors } })

const returnSuccess = (res, result, status) =>
    res.status(status).json({ data: result })

usersRouter
    .post('/allowEdit', async (req, res, _next) => {
        try {
            const { email: emailOfLoggedInUser } = req.user
            const { documentToEditId, userWhoShouldEditId } = req.body
            const result = await database.users.allowUserToEditDocument({
                emailOfLoggedInUser,
                documentToEditId,
                userWhoShouldEditId,
            })
            return returnSuccess(res, result, 201)
        } catch (errors) {
            return returnError(res, errors)
        }
    })
    .post('/create', async (req, res, _next) => {
        try {
            const { email, password } = req.body
            const result = await database.users.registerUser({
                email,
                password,
            })
            req.logIn({ email }, (err) => {
                if (err) throw err
            })
            return returnSuccess(res, result, 201)
        } catch (errors) {
            return returnError(res, errors)
        }
    })
    // https://github.com/woodburydev/passport-local-video/blob/master/backend/server.js
    .post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) throw err
            if (!user) returnError(res, { message: 'Invalid credentials' })
            else {
                req.logIn({ email: user.email }, (err) => {
                    if (err) throw err
                    res.json({ data: 'Successfully Authenticated' })
                })
            }
        })(req, res, next)
    })
    // .put('/update', async ({ body: { id, html, name } }, res, _next) => {
    //     try {
    //         const result = await database.documents.updateDocument(
    //             id,
    //             html,
    //             name
    //         )
    //         return returnSuccess(res, result, 200)
    //     } catch (errors) {
    //         return returnError(res, errors)
    //     }
    // })
    // TODO: Consider if this function is needed
    .get('/', async (req, res, _next) => {
        try {
            const result = await database.users.getAllUsers({
                email: req.user?.email ? req.user.email : null,
            })
            return returnSuccess(res, result, 200)
        } catch (errors) {
            return returnError(res, errors)
        }
    })
// .get('/:id', async ({ params: { id } }, res, _next) => {
//     try {
//         const result = await database.documents.getOneDocument(id)
//         return returnSuccess(res, result, 200)
//     } catch (errors) {
//         return returnError(res, errors)
//     }
// })

// database.users.registerUser()
