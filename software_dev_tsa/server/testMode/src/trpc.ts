// for later use and upgrading (for now directly implemented into the websocket server)
import { initTRPC } from "@trpc/server"
import mongoose from "mongoose"

const Tests = mongoose.model("Test")

const t = initTRPC.create()
const router = t.router
const procedure = t.procedure

const testRouter = router({
    startTest: procedure
        .input((id: unknown) => {
            if(typeof id==='string') return id;
            throw new Error("Invalid input type")
        })
        .mutation(async (req) => {
            const doc = await Tests.findByIdAndUpdate(req.input, { started: true })
            return doc
        }),
    endTest: procedure
        .input((id: unknown) => {
            if(typeof id==='string') return id;
            throw new Error("Invalid input type")
        })
        .mutation(async (req) => {
            const doc = await Tests.findByIdAndUpdate(req.input, { finished: true })
            return doc
        }),
    submitResponse: procedure
        .input((id: unknown, ))
})