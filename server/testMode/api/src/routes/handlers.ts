import { Request, Response } from 'express'
import mongoose from 'mongoose'
import type { Test } from '../schema'

const Tests = mongoose.model("Test")

const createTest = async (req: Request, res: Response) => {
    const test: Test = req.body
    const t = await new Tests(test).save()
    res.status(200, {user: t})
}

const getTest = async (req: Request, res: Response) => {
    const 
}