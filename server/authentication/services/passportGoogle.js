const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')

const User = mongoose.model("users")

passport.use(
    new GoogleStrategy({
        clientID: "832381466881-qv7vrcbf65h1kjmfvrr647oe6ob7u295.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/auth/google/callback",
        proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
        const existingUser = await User.findOne({ googleId: profile.id })
        if(existingUser) return done(null, user)
        
        const user = await new User({
            provider: 'google',
            googleId: profile.id,
            username: profile._json.name,
            email: profile._json.email,
        }).save()
        return done(null, user)
    })
)