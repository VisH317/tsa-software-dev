const mongoose = require("mongoose")
const keys = require("./keys/keys")

console.log("HELLO")
mongoose.connect(keys.MongoURI)
    .then(() => console.log("connected!"))
    .catch(err => console.log("ERR: ", err))