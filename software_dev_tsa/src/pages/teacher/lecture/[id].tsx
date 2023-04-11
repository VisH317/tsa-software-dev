import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Lecture } from '@/lib/classData'

export default function TeacherLecture() {
    const router = useRouter()
    const { id } = router.query
    const [lec, setLec] = useState<Lecture>()

    // fetch list of lectures with react-query
    const { status, data, error, isFetching } = useQuery({
        queryKey: ['teacherClasses', id],
        queryFn: async ({ queryKey }) => {
            const [_, cid] = queryKey
            console.log(cid)
            if(cid===undefined) return
            const res = await axios.get("/api/lectures", { params: { class: cid } })
            return res.data
        }
    })

    // select the desired lecture based on the ID fetched from the route
    useEffect(() => {
        if(status==='success') {
            data.map((l:Lecture) => {
                if(l.Id===parseInt(id as string)) setLec(l)
            })
        }
    }, [status])

    // websocket setup
    const socket = io("ws://localhost:8080")

    // NOTES: events to emit - createRoom, deleteRoom

}