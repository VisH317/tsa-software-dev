const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const keys =require('./keys/keys')

require('./model/User')

mongoose.connect(keys.MongoURI) 

const app = express()

require('./services/serialize')
require('./services/passportGoogle')
require('./services/passportLocal')
require('./services/passportjwt')

app.use(session({
    secret: keys.JWTSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/', require("./routes/routes"))

const PORT = 3000
app.listen(PORT, () => console.log('server started'))
