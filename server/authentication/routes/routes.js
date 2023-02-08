const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = mongoose.model('users')

const router = express.Router()

router.post("/auth/local", async (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
        try {
            if(err || !user) {
                const error = new Error("Error bruh")
                return next(error)
            }
            req.login(user, { session: false }, async (error) => {
                if(error) return next(error)
                const body = { _id: user._id, email: user.email, expiresIn: '12h' }
                const token = jwt.sign({ user: body }, "SECRET_POG")
                res.json({ token, user: req.user })
            })
        } catch(error) {return next(error)}
    })
})

router.post("/auth/signup", async (req, res, next) => {
    const { username, password, email } = req.body
    const existingUser = User.findOne({ email })
    if(existingUser) return next(null, false, { message: "already registered" })
    const user = await new User({
        provider: "email",
        email,
        username,
        password
    }).save()

    res.json({ message: "signup success" })
})

router.get('/auth/logout', (req, res) => {
    req.session.destroy()
    req.logout()
})

router.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'], session: true}))

router.get("/auth/google/callback", passport.authenticate('google', { failureMessage: "/auth/google/err" }), (req, res) => {
    const body = { _id: user._id, email: user.email, expiresIn: '12h' }
    const token = jwt.sign({ user: body }, "SECRET_POG")
    res.cookie('auth-token', token)
    res.redirect("/")
})

router.get("/auth/test", (req, res) => res.send("hola como estas"))

module.exports = router