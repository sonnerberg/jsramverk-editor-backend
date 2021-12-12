import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as LocalStrategy } from 'passport-local'
import database from './db/database.js'
import { comparePasswords, hashPassword } from './db/hashing.js'
const { NODE_ENV, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env

function getBackendURL() {
    return NODE_ENV === 'production'
        ? 'https://jsramverk-editor-pene14.azurewebsites.net'
        : 'http://localhost:1337'
}

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async function (
        username,
        password,
        done
    ) {
        const user = await database.users.findOne({ username: username })
        if (!user) return done(null, false, { message: 'Incorrect username' })
        const matchingPasswords = await comparePasswords(
            password,
            user.password
        )
        if (!matchingPasswords) {
            console.error('Incorrect password')
            return done(null, false, { message: 'Incorrect password' })
        }

        return done(null, user)
    })
)

passport.use(
    new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: `${getBackendURL()}/auth/v1/github/callback`,
            scope: 'user:email',
            // https://github.com/jaredhanson/passport-github/issues/15
        },
        async (accessToken, refreshToken, profile, done) => {
            if (profile.emails[0].value) {
                profile.email = profile.emails[0].value
            }
            try {
                await database.users.registerUserWithRandomPassword({
                    username: profile.email,
                })
            } catch (err) {
                console.error(err)
            }
            return done(null, profile)
        }
    )
)

passport.serializeUser(function (user, cb) {
    cb(null, user)
})

passport.deserializeUser(function (obj, cb) {
    cb(null, obj)
})

export default passport
