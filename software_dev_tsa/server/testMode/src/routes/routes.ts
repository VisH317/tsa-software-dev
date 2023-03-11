import express, { Router } from 'express'
import { getTests, createTest } from './handlers'

const router: Router = express.Router()

router.get("/", getTests)
router.post("/", createTest)

export default router