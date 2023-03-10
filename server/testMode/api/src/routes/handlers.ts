import { Request, Response } from 'express'
import mongoose from 'mongoose'
import type { Test } from '../schema'

const Tests = mongoose.model("Test")

export const createTest = async (req: Request, res: Response): Promise<void> => {
    const test: Test = req.body
    const t = await new Tests(test).save()

    res.status(200).json({ test: t })
}

export const getTests = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(req.query("id")!=="" ? await getTestsById(req.query("id")) : await getTestsForClassroom(req.query("classroom")))
}


const getTestsForClassroom = async (classroomID: number): Promise<Test | null> => {
    const test: Test | null = await Tests.findOne({ classroomID })
    if(test===null) console.error("findone failed")
    return test
}


export const getTestsById = async (id: string): Promise<Test | null> => {
    const test: Test | null = await Tests.findById(id)
    if(test===null) console.error("findbyid failed")
    return test
}