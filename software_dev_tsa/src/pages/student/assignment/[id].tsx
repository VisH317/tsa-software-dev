import { Assignment } from '@/components/ClassHome/Assignments'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useUser } from '@/lib/user'
import MiniDrawer from '@/components/Dashboard/Drawer'
import { montserrat } from '@/styles/fonts'

export default function AssignmentView() {
    const router = useRouter()
    const user = useUser()
    const { id } = router.query
    const [assignment, setAssignment] = useState<Assignment>()
    const [overdue, setOverdue] = useState<boolean>(false)

    const queryClient = useQueryClient()

    const queryRes = useQuery({
        queryKey: ["assignmentbyid", id],
        queryFn: async ({ queryKey }) => {
            const [_, cid] = queryKey
            if(cid===undefined || cid.length===0) return
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
            if(user.state!=="hasData") return {}
            const res = await axios.get('/api/responses/student', { params: { assignment: id, user: user.data.email } })
            const data: AssignmentResponse | {} = res.data
            return data   
        },
        initialData: { msg: "initial" }
    })

    const createResponse = useMutation({
        mutationFn: async () => {
            if(user.state!=="hasData") return
            console.log("mutating!!!")
            const body: AssignmentResponse = {
                Assignmentid: parseInt(id as string),
                Content: resp,
                Users: [user.data.email, ...team.split(", ")]
            }

            await axios.post("/api/responses", body)
        },
        onSuccess: () => {
            if(user.state!=="hasData") return
            queryClient.invalidateQueries(["assignmentresponse", id, user.data.email])
        }
    })

    const updateResponse = useMutation({
        mutationFn: async () => {
            if(user.state!=="hasData") return
            console.log("updating!!!")
            console.log("responseQuery: ", responseQuery.data)
            const users = (responseQuery.data as AssignmentResponse).Users
            console.log("users: ", users)
            const body: AssignmentResponse = {
                Assignmentid: parseInt(id as string),
                Content: resp,
                Users: users
            }

            await axios.patch("/api/responses", body)
        },
        onSuccess: () => {
            if(user.state!=="hasData") return
            queryClient.invalidateQueries(['assignmentresponse', id, user.data.email])
        }
    })

    const [resp, setResp] = useState<string>(responseQuery.data.Content)
    const [team, setTeam] = useState<string>("")

    const renderResponse = () => {
        if(Object.keys(responseQuery.data).length===0) return (
            <div className="w-full">
                no response submitted yet
                <textarea rows={10} cols={40} className="w-[40%] border-slate-400 border-2" placeholder={"Submit a response..."} value={resp} onChange={e => setResp(e.target.value)}/>
                <input type="text" placeholder="Emails of other classmates you worked with" value={team} onChange={e => setTeam(e.target.value)}/>
                <button onClick={() => void createResponse.mutateAsync()}>Submit Response</button>
            </div>
        )
        return (
            <div className="h-full">
                <div className="w-[100%] h-[50%] flex flex-col gap-5">
                    <p className="text-xl text-slate-700 font-medium">Update your response:</p>
                    <textarea rows={30} cols={40} value={resp} className="w-full h-full border-slate-400 border-2" onChange={e => setResp(e.target.value)}/>
                </div>
                <div className="h-8"/>
                <button className="w-full border-slate-400 border-2 p-5 rounded-lg text-slate-400 hover:-translate-y-1 duration-150" onClick={() => void updateResponse.mutateAsync()}>Update Response</button>
            </div>
        )
    }

    // states and handlers for drawer
    const [open, setOpen] = useState(false)
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)

    return (
        <MiniDrawer open={open} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen}>
            <div className="w-screen h-screen bg-slate-400 flex justify-center items-center">
                <div className={`p-10 font-sans ${montserrat.variable} w-screen bg-white w-1/2 rounded-lg`}>
                    <p className="text-5xl">Assignment: {assignment?.Title}</p>
                    <div className="h-8"/>
                    <p className="text-xl text-slate-600">Due Date: {assignment?.Duedate}, {overdue ? "OVERDUE" : ""}</p>
                    <div className="h-8"/>
                    <p>{assignment?.Descr}</p>
                    <div className="h-16"/>
                    {renderResponse()}
                </div>
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