import express from 'express'
import passport from 'passport'
import { ensureLoggedIn } from 'connect-ensure-login'

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
            res.redirect('http://localhost:3000/editor')
        }
    )
    .get(
        '/user',
        // ensureLoggedIn('/auth/v1/github'),
        (req, res) => {
            res.json({ data: req.user })
        }
    )
    .get('/logout', (req, res) => {
        req.logout()
        res.redirect('http://localhost:3000')
    })
