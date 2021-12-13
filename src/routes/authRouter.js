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
            res.redirect(`${getFrontendURL()}/~pene14/editor/editor`)
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
        console.log(
            'the user is logging out and is being redirected to:',
            `${getFrontendURL()}/~pene14/editor`
        )
        req.logout()
        res.redirect(`${getFrontendURL()}/~pene14/editor`)
    })
