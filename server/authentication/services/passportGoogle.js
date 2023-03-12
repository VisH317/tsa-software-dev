const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require("../keys/keys")

const User = mongoose.model("users")

passport.use(
    new GoogleStrategy({
        clientID: keys.clientID,
        clientSecret: keys.clientSecret,
        callbackURL: "/auth/google/callback",
        proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({ googleId: profile.id })
        if(existingUser) {
            return done(null, existingUser)
        }
        
        const user = await new User({
            provider: 'google',
            googleId: profile.id,
            username: profile._json.name,
            email: profile._json.email,
        }).save()
        return done(null, user)
    })
)