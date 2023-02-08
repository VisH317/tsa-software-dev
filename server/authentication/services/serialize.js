const passport = require('passport')
const mongoose = require('mongoose')

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
    return done(null, user._id)
})

passport.deserializeUser((obj, done) => {
    User.findById(obj, (err, user) => done(null, user))
})