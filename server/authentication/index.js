const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const connectRedis = require('connect-redis')
const redis = require('redis')
const keys =require('./keys/keys')

require('./model/User')

mongoose.connect(keys.MongoURI) 

const app = express()

// redis setup
const redisStore = connectRedis(session)

const redisClient = redis.createClient({
    host: "localhost",
    port: 6379,
    legacyMode: true
})

redisClient.connect().catch(console.error)

redisClient.on('error', err => console.log(err))
redisClient.on('connect', () => console.log("redis connected"))

require('./services/serialize')
require('./services/passportGoogle')
require('./services/passportLocal')
//require('./services/passportjwt')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    // store: new redisStore({ client: redisClient }),
    secret: keys.JWTSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: false, maxAge: 1000*60*24 }
}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use('/', require("./routes/routes"))

const PORT = 3000
app.listen(PORT, () => console.log('server started'))
