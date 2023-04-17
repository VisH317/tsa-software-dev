import React, { useState } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface AssignmentsProps {
    classID: number
}

export default function Assignments({ classID }: AssignmentsProps) {

    const [assignments, setAssignments] = useState<Assignment[]>([])

    const { status, data, error, isFetching } = useQuery({
        queryKey: ["assignments", classID],
        queryFn: async ({ queryKey }) => {
            const [_, classId] = queryKey
            const res = await axios.get("/api/assignments", { params: { class:  classId } })
            setAssignments(res.data)
            return res.data
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

    return (
        <div className="relative">
            <h1>ASSIGNMENTS:</h1>
            {mapAssignments()}
            <button className="absolute bottom-20 right-20 w-24 h-24 "
        </div>
    )
}

type Assignment = {
    Classroomid: number,
    Title: string,
    Desc: string,
    Duedate: string
}