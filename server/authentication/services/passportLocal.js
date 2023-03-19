const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')

const User = mongoose.model("users")

passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    },
    async (email, password, done) => {
        console.log("logging in pog")
        User.findOne({ email }, async (err, user) => {
            console.log("hla como estas")
            if(!user) return done(null, false)

            const validate = await user.isValidPassword(password)
            if(!validate) return done(null, false)

            return done(null, user)
        }) 
    })
)

// passport.use(
//     'signup',
//     new LocalStrategy({
//         usernameField: "email",
//         passwordField: "password"
//     }, async (email, password, done) => {
//         const existingUser = await LocalUser.findOne({ email })
//         if(existingUser) return done(null, false, { message: "user already created" })

//         const existingGoogleUser = await GoogleUser.findOne({ email })
//         if(existingGoogleUser) {
//             const user = await new LocalUser({
//                 email,
//                 password,
//                 _googleuser: existingGoogleUser.id
//             }).save()
//             return done(null, user)
//         }

//         const user = await new LocalUser({ email, password })
//         return done(null, user)
//     })
// )