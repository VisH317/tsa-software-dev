import React, { useState } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { Assignment } from './Assignments'
import axios from 'axios'
import { useRouter } from 'next/router'
import { montserrat } from '@/styles/fonts'

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
                <div className="p-5 w-[25%] aspect-[4/3.5] rounded-lg border-slate-100 border-2 relative overflow-hidden hover:shadow-lg duration-150">
                    <p className="ml-[5%] text-5xl text-slate-700 font-normal">{a.Title}</p>
                    <div className="h-4"/>
                    <p className='ml-[5%] text-slate-400 text-lg'>Max Group Size: {a.MaxGroup}</p>
                    <div className="h-2"/>
                    <h6 className='ml-[5%] text-slate-400 text-lg'>Due: {a.Duedate}{isOverdue ? ", OVERDUE" : ""}</h6>
                    <div className="h-2"/>
                    <p className="ml-[5%] text-md">Desc: {a.Descr}</p>
                    <div className="absolute bottom-0 left-0 p-5 bg-slate-100 w-full flex flex-row justify-end pr-10">
                        <button onClick={() => void routeToAssignment(a.Id)} className="bg-slate-800 px-3 py-2 text-white font-medium rounded-lg border-slate-100 border-4 hover:-translate-y-1 hover:border-green-200 hover:bg-green-500 duration-300">Open Assignment</button>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={`h-full ${montserrat.variable} font-sans p-10`}>
            <h1 className="text-5xl text-slate-700 font-medium">Your Assignments</h1>
            <div className="h-8"/>
            <div className="flex flex-row flex-wrap">
                {mapAssignments()}
            </div>
        </div>
    )
}