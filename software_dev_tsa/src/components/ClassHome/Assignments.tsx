import React, { useState } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import colors from '@/styles/colors'
import Modal from '../Modal/Modal'

interface AssignmentsProps {
    classID: number
}

export default function Assignments({ classID }: AssignmentsProps) {

    const [assignments, setAssignments] = useState<Assignment[]>([])

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

    const mapAssignments = () => {
        return assignments.map(a => {
            console.log("Not now: ", new Date(Date.parse(a.Duedate)).getTime())
            console.log("now: ",Date.now())
            const isOverdue = new Date(Date.parse(a.Duedate)).getTime() < Date.now() ? true : false
            console.log("id: ", a.Id)
            return (
                <div className="p-5">
                    <h1>Title: {a.Title}</h1>
                    <p>Desc: {a.Descr}</p>
                    <p>Max Group Size: {a.MaxGroup}</p>
                    <h6>Due: {a.Duedate}{isOverdue ? ", OVERDUE" : ""}</h6>
                    <button onClick={() => void classDeleteMut.mutateAsync(a.Id)}>Delete Class</button>
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

    const createAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
        <div className="h-full">
            <h1>ASSIGNMENTS:</h1>
            {mapAssignments()}
            <button className={`absolute bottom-20 right-20 w-24 h-24 rounded-[50%] bg-main text-5xl text-white`} onClick={() => setOpen(true)}>+</button>
            <Modal open={open} close={close}>
                <h2>Create a New Assignment</h2>
                <form onSubmit={createAssignment} className="flex flex-col gap-10">
                    <input type='text' placeholder="Title:" value={title} onChange={e => setTitle(e.target.value)}/>
                    <input type="text" placeholder="Description:" value={desc} onChange={e => setDesc(e.target.value)}/>
                    <input type="datetime-local" placeholder="Due Date:" value={dueDate} onChange={e => setDueDate(e.target.value)}/>
                    <input type="number" placeholder="Group Size" value={groupNum} onChange={e => setGroupNum(parseInt(e.target.value))}/>
                    <button type="submit">Create Assignment</button>
                </form>
            </Modal>
        </div>
    )
}

type Assignment = {
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