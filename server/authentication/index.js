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

async function conn() {
    console.log("hello")
    await mongoose.connect(keys.MongoURI)
    console.log("bruh")
}

mongoose.set("strictQuery", false)

const options = {
    socketTimeoutMS: 1000,
    dbName: "TSAClassroom"
}

conn().catch(err => console.log(err))

const User = mongoose.model('users')

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
// app.post("/auth/signup", async (req, res, next) => {
//     const { username, password, email } = req.body
//     console.log("askdjfhwieufhskdjfhskdjfh")
//     const existingUser = User.findOne({ email })
//     if(existingUser) return next(null, false, { message: "already registered" })
//     const user = await new User({
//         provider: "email",
//         email,
//         username,
//         password
//     }).save()

//     res.json({ message: "signup success" })
// })

const PORT = 5000
app.listen(PORT, () => console.log('server started'))
