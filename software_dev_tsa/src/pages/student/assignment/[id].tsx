import { Assignment } from '@/components/ClassHome/Assignments'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useUser } from '@/lib/user'
import MiniDrawer from '@/components/Dashboard/Drawer'

export default function AssignmentView() {
    const router = useRouter()
    const user = useUser()
    const { id } = router.query
    const [assignment, setAssignment] = useState<Assignment>()
    const [overdue, setOverdue] = useState<boolean>(false)

    const queryRes = useQuery({
        queryKey: ["assignmentbyid", id],
        queryFn: async ({ queryKey }) => {
            const [_, cid] = queryKey
            const res = await axios.get("/api/assignments/id", { params: { id: cid } })

            setAssignment(res.data)
            const isOverdue = new Date(Date.parse(assignment?.Duedate as string)).getTime() < Date.now()
            setOverdue(isOverdue)

            return res.data
        }
    })

    const responseQuery = useQuery({
        queryKey: ["assignmentresponse", id, user.state==="hasData" ? user.data.email : ""],
        queryFn: async ({ queryKey }) => {
            if(user.state!=="hasData") return { msg: "loading" }
            const [_, asid, uid] = queryKey
            const res = await axios.get('/api/responses/student', { params: { assignment: id, user: user.data.email } })
            const data: AssignmentResponse | NoResponse = res.data
            return data   
        },
        initialData: { msg: "initial" }
    })

    const renderResponse = () => {
        if(Object.keys(responseQuery.data).includes("msg")) return <div>no response submitted yet</div>
        return (
            <div>
                {(responseQuery.data as AssignmentResponse).Content}
            </div>
        )
    }

    // states and handlers for drawer
    const [open, setOpen] = useState(false)
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)

    return (
        <MiniDrawer open={open} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen}>
            <div className="p-10">
                <p className="text-5xl">Assignment: {assignment?.Title}</p>
                <p className="text-xl text-slate-600">Due Date: {assignment?.Duedate}, {overdue ? "OVERDUE" : ""}</p>
                <p>{assignment?.Descr}</p>
                {renderResponse()}
            </div>
        </MiniDrawer>
    )
}

export type AssignmentResponse = {
    Assignmentid: number
    Users: string[]
    Content: string
}

type NoResponse = { msg: string }