import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import routes from "./routes/routes"
import keys from "./keys/keys.js"
import { spawn } from "child_process"

// create rate limiter cleanup process

// mongodb
require("./models/testSchema")
mongoose.connect(keys.MongoURI)

const app: Express = express()

// middleware
app.use(bodyParser)

// routes
app.use("/api/tests/", routes)

//app.get("/api/simple_test", (req: Request, res: Response) => res.send("bruh"))

const PORT: number = 5050

app.listen(PORT, () => console.log("started"))