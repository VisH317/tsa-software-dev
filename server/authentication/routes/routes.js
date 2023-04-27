const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = mongoose.model('users')

const router = express.Router()

router.post("/auth/local", passport.authenticate("local"), (req, res) => res.redirect("/"))

router.post("/auth/signup", async (req, res) => {
    const { username, password, email } = req.body
    console.log("askdjfhwieufhskdjfhskdjfh")
    const existingUser = await User.findOne({ email })
    if(existingUser) return res.json({ message: "already registered bruh" })
    const user = await new User({
        provider: "email",
        email,
        username,
        password
    }).save()

    res.json({ message: "signup success" })
})

router.get("/auth/signup", (req, res) => res.send("bruh"))

router.get('/auth/logout', (req, res) => {
    req.session.destroy()
    req.logout(err => {
        res.redirect('/')
    })
})



router.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email']}), (req, res) => res.redirect("/home"))

router.get("/auth/google/callback", passport.authenticate('google', { failureMessage: "/auth/google/err" }), (req, res) => {
    res.redirect("/home")
})

// router.get("/auth/test", passport.authorize('google'), (req, res) => res.send("hola como estas"))

router.get('/auth/current_user', (req, res) => {
    res.send(req.user)
})

module.exports = router