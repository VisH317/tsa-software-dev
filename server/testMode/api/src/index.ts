import express, { Express, Request, Response } from 'express'
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// mongodb
const MONGO_URI = "placeholder"
require("./models/testSchema")
mongoose.connect(MONGO_URI, () => console.log("database connected"))

const app: Express = express()

// middleware
app.use(bodyParser)

// routes

app.get("/api/simple_test", (req: Request, res: Response) => res.send("bruh"))

const PORT: number = 5050

app.listen(PORT, () => console.log("started"))