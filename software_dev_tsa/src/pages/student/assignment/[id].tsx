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
            const isOverdue = new Date(Date.parse(a.Duedate)).getTime() < Date.now()
            setOverdue(isOverdue)

            return res.data
        }
    })

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
            </div>
        </MiniDrawer>
    )
}