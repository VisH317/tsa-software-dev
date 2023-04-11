import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Lecture } from '@/lib/classData'
import { useUser, Email } from '@/lib/user'

// IMPORTANT FOR LATER: add check for lecture being accessed is in the right class

export default function TeacherLecture() {
    const router = useRouter()
    const user = useUser()
    const { id } = router.query
    const [lec, setLec] = useState<Lecture>()
    const [students, setStudents] = useState<Email[]>()

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

    const socket = io("ws://localhost:8080")

    const closeRoom = () => {
        if(user.state!=="hasData") return
        socket.emit("deleteRoom", user.data.email, lec?.Id)
    }

    // select the desired lecture based on the ID fetched from the route
    useEffect(() => {
        if(status==='success') {
            data.map((l:Lecture) => {
                if(l.Id===parseInt(id as string)) setLec(l)
                socket.emit("createRoom", lec?.Id, lec?.ClassID)
            })
        }
    }, [status])


    if(status==="loading") return <div>LOADING</div>
    if(status==='error') return <div>error</div>
    
    return (
        <button onClick={closeRoom}>Close Room</button>
    )
    // NOTES: events to emit - createRoom, deleteRoom, for student: joinRoom leaveRoom (with notes UI)
    // render a list of people in the meeting and change when receiving a leave or join room

}