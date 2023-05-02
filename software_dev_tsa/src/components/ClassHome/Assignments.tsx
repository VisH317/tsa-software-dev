import React, { useState } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import colors from '@/styles/colors'
import Modal from '../Modal/Modal'
import { montserrat } from '@/styles/fonts'
import { Tooltip, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

interface AssignmentsProps {
    classID: number
}

interface AssignmentRes {
    Assignmentid: number
    Users: string[]
    Content: string
    Duedate: string
}

export default function Assignments({ classID }: AssignmentsProps) {

    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [curAssignment, setCurAssignment] = useState<Assignment>()
    const [responses, setResponses] = useState<AssignmentRes[]>([])

    // queries and mutations
    const queryClient = useQueryClient()
    const { status, data, error, isFetching } = useQuery({
        queryKey: ["assignments", classID],
        queryFn: async ({ queryKey }) => {
            const [_, classId] = queryKey
            const res = await axios.get("/api/assignments", { params: { class:  classId } })
            setAssignments(res.data)
            return res.data
        }
    })

    const classMut = useMutation({
        mutationKey: ["assignments", classID],
        mutationFn: async (a: CreateAssignment) => { await axios.post("/api/assignments", a) },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments", classID] })
        }
    })

    const classDeleteMut = useMutation({
        mutationFn: async (id: number) => { await axios.delete("/api/assignments", { params: { id } }) },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments", classID] })
        }
    })

    const [resOpen, setResOpen] = useState<boolean>(false)

    const openResponses = async (a: Assignment): Promise<void> => {
        console.log("id again: ", a.Id)
        const { data }: { data: AssignmentRes[] }  = await axios.get("/api/responses", { params: { assignment: a.Id } })
        console.log("data: ", data)
        setCurAssignment(a)
        setResponses(data)
        setResOpen(true)
    }

    const mapResponses = () => {
        return responses.map(r => (
            <div className="w-[90%] border-b-2 border-slate-300">
                <div className="w-full p-10 hover:border-slate-300">
                    <p className="text-lg text-slate-500">{r.Content}</p>
                    <div className="h-2"/>
                    <p className="text-md text-slate-700">From: {r.Users.join(", ")}</p>
                </div>
            </div>
        ))
    }

    const mapAssignments = () => {
        return assignments.map(a => {
            console.log("Not now: ", new Date(Date.parse(a.Duedate)).getTime())
            console.log("now: ",Date.now())
            const isOverdue = new Date(Date.parse(a.Duedate)).getTime() < Date.now() ? true : false
            console.log("id: ", a.Id)
            return (
                <div className="p-5 w-[20%] aspect-[4/3] rounded-lg border-slate-100 border-2 relative overflow-hidden hover:shadow-lg duration-150">
                    <p className="ml-[5%] text-5xl text-slate-700 font-normal">{a.Title}</p>
                    <div className="h-4"/>
                    <p className='ml-[5%] text-slate-400 text-lg'>Max Group Size: {a.MaxGroup}</p>
                    <div className="h-2"/>
                    <h6 className='ml-[5%] text-slate-400 text-lg'>Due: {a.Duedate}{isOverdue ? <p className="text-lg text-green-500 font-medium">Due date passed</p> : ""}</h6>
                    <div className="h-2"/>
                    <p className="ml-[5%] text-md">Desc: {a.Descr}</p>
                    <div className="absolute bottom-0 left-0 p-5 bg-slate-100 w-full flex flex-row justify-end gap-2 pr-10">
                        <button onClick={() => void openResponses(a)} className="bg-slate-800 px-3 py-2 text-white font-medium rounded-lg border-slate-100 border-4 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-600 duration-300">See Responses</button>
                        <button onClick={() => void classDeleteMut.mutateAsync(a.Id)} className="bg-red-500 px-3 py-2 text-white font-medium rounded-lg border-slate-100 border-4 hover:-translate-y-1 hover:border-red-100 hover:bg-red-400 duration-300">Delete</button>
                    </div>
                </div>
            )
        })
    }

    // modal states
    const [open, setOpen] = useState<boolean>(false)
    const close = () => { setOpen(false) }

    // form states
    const [title, setTitle] = useState<string>("")
    const [desc, setDesc] = useState<string>("")
    const [dueDate, setDueDate] = useState<string>("")
    const [groupNum, setGroupNum] = useState<number>(1)

    const createAssignment = async () => {
        const date = new Date(dueDate).toISOString()
        const body: CreateAssignment = {
            Classroomid: classID,
            Title: title,
            Descr: desc,
            Duedate: date,
            MaxGroup: groupNum
        }
        await classMut.mutateAsync(body)
        close()
    }

    return (
        <div className={`h-full ${montserrat.variable} font-sans p-10`}>
            <h1 className="text-5xl text-slate-700 font-medium">Your Assignments</h1>
            <div className="h-8"/>
            <div className="flex flex-row flex-wrap">
                {mapAssignments()}
            </div>
            <Tooltip placement="left" title="New Lecture" arrow>
                <IconButton sx={{backgroundColor: colors.main, color: colors.white, position: "fixed", bottom: "5%", right: "4%", boxShadow: "2px 2px 6px #777", "&:hover": {boxShadow: "0", backgroundColor: colors.light}}} onClick={() => setOpen(true)}>
                    <AddIcon fontSize="large" sx={{fontSize: "60px",}}/>
                </IconButton>
            </Tooltip>  
            <Modal open={open} close={close} height="65vh">
                <form className="flex flex-col gap-10 items-center justify-around p-10 relative w-full">
                    <p className="text-4xl">Create a New Assignment</p>
                    <input className="flex-none p-5 w-[80%] border-2 rounded-lg border-slate-400 hover:border-slate-500 duration-300 focus:border-green-500" type='text' placeholder="Title:" value={title} onChange={e => setTitle(e.target.value)}/>
                    <input className="flex-none p-5 w-[80%] border-2 rounded-lg border-slate-400 hover:border-slate-500 duration-300 focus:border-green-500" type="text" placeholder="Description:" value={desc} onChange={e => setDesc(e.target.value)}/>
                    <input className="flex-none p-5 w-[80%] border-2 rounded-lg border-slate-400 hover:border-slate-500 duration-300 focus:border-green-500" type="datetime-local" placeholder="Due Date:" value={dueDate} onChange={e => setDueDate(e.target.value)}/>
                    <input className="flex-none p-5 w-[80%] border-2 rounded-lg border-slate-400 hover:border-slate-500 duration-300 focus:border-green-500" type="number" placeholder="Group Size" value={groupNum} onChange={e => setGroupNum(parseInt(e.target.value))}/>
                </form>
                <div className="absolute bottom-0 left-0 bg-slate-100 w-full py-8 px-10 flex justify-end pr-40">
                    <button className={`bg-green-500 px-5 py-3 text-xl text-white font-sans ${montserrat.variable} duration-300 hover:-translate-y-1 hover:bg-green-500 border-4 border-slate-100 hover:border-green-200 rounded-lg`} onClick={createAssignment}>Create Assignment</button>
                </div>
            </Modal>
            <Modal open={resOpen} close={() => setResOpen(false)} height="65vh">
                <div className="flex flex-col items-center p-10">
                    <p className='text-4xl text-slate-800'>{curAssignment?.Title}</p>
                    <div className="h-6"/>
                    {mapResponses()}
                </div>
            </Modal>
        </div>
    )
}

export type Assignment = {
    Classroomid: number,
    Title: string,
    Descr: string,
    Duedate: string,
    Id: number,
    MaxGroup: number
}

type CreateAssignment = {
    Classroomid: number,
    Title: string,
    Descr: string,
    Duedate: string,
    MaxGroup: number
}