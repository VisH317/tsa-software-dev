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
        mutationFn: async (a: Assignment) => { await axios.post("/api/assignments", a) },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments", classID] })
        }
    })



    const mapAssignments = () => {
        return assignments.map(a => {
            const isOverdue = Date.parse(a.Duedate) < Date.now() ? true : false
            return (
                <div>
                    <h1>{a.Title}</h1>
                    <p>{a.Desc}</p>
                    <h6>Due: {a.Duedate}{isOverdue ? ", OVERDUE" : ""}</h6>
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

    const createAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const date = new Date(dueDate).toISOString()
        const body: Assignment = {
            Classroomid: classID,
            Title: title,
            Desc: desc,
            Duedate: date,
        }
        await classMut.mutateAsync(body)
        close()
    }

    return (
        <div className="relative">
            <h1>ASSIGNMENTS:</h1>
            {mapAssignments()}
            <button className={`absolute bottom-20 right-20 w-24 h-24 rounded-[50%] bg-main text-3xl`} onClick={() => setOpen(true)}>+</button>
            <Modal open={open} close={close}>
                <h2>Create a New Assignment</h2>
                <form onSubmit={createAssignment}>
                    <input type='text' placeholder="Title:" value={title} onChange={e => setTitle(e.target.value)}/>
                    <input type="text" placeholder="Description:" value={desc} onChange={e => setDesc(e.target.value)}/>
                    <input type="datetime-local" placeholder="Due Date:" value={dueDate} onChange={e => setDueDate(e.target.value)}/>
                </form>
            </Modal>
        </div>
    )
}

type Assignment = {
    Classroomid: number,
    Title: string,
    Desc: string,
    Duedate: string
}