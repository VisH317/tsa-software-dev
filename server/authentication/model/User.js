const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    provider: String,
    username: String,
    googleId: String,
    password: String,
    email: String,
})

mongoose.model('users', userSchema)