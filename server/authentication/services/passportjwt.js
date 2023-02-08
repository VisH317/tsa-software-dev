const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt')
const mongoose = require('mongoose')
const keys = require('../keys/keys')

const User = mongoose.model('users')

const jwtLogin = new Strategy({
    jwtFromRequest: ExtractJwt.fromHeader('auth-token'),
    secretOrKey: keys.JWTSecret,
    passReqToCallback: true
}, async (req, payload, done) => {
    const user = await User.findById(payload.id)
    if(!user) return done(null, false)
    req.user = user
    return done(null, user)
})

passport.use(jwtLogin)