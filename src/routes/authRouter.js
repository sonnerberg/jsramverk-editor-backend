import express from 'express'
import passport from 'passport'
import { ensureLoggedIn } from 'connect-ensure-login'
import { getFrontendURL } from '../getFrontendURL.js'

export const authRouter = express.Router()

authRouter
    .get('/github', passport.authenticate('github'))
    .get(
        '/github/callback',
        passport.authenticate('github', {
            failureRedirect: '/login',
        }),
        function (_req, res) {
            // Successful authentication, redirect home.
            res.redirect(`${getFrontendURL()}`)
            // TODO: Make the below url work by fixing being able to manually refresh pages outside of the root page
            // res.redirect(`${getFrontendURL()}/editor`)
        }
    )
    .get(
        '/user',
        // ensureLoggedIn('/auth/v1/github'),
        (req, res) => {
            return res.json({ data: req.user })
        }
    )
    .get('/logout', (req, res) => {
        req.logout()
        res.redirect(getFrontendURL())
    })
