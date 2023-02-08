const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt')
const mongoose = require('mongoose')
const keys = require('../keys/keys')

const User = mongoose.model('users')

const jwtLogin = new Strategy({
    jwtFromRequest: ExtractJwt.fromHeader('auth-token'),
    secretOrKey: keys.JWTSecret
}, async (payload, done) => {
    const user = await User.findById(payload.id)
    if(!user) done(null, false)
    else done(null, user)
})

passport.use(jwtLogin)