import React, { useState } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { Assignment } from './Assignments'
import axios from 'axios'
import { useRouter } from 'next/router'

interface AssignmentsStudentProps {
    classID: number
}

export default function AssignmentsStudent({ classID }: AssignmentsStudentProps) {
    
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const router = useRouter()

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

    const routeToAssignment = async (id: number) => {
        await router.push(`/student/assignment/${String(id)}`)
    }

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
                    <h6>Due: {a.Duedate}<h6 className="text-red-500">{isOverdue ? ", OVERDUE" : ""}</h6></h6>
                    <button onClick={() => void routeToAssignment(a.Id)}>Open Assignment</button>
                </div>
            )
        })
    }

    return (
        <div className="w-full h-full">
            <p className="text-4xl text-slate-800">Your Assignments: </p>
            {mapAssignments()}
        </div>
    )
}