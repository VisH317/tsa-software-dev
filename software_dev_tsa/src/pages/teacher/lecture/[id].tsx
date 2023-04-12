import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Lecture, StartLectureData } from '@/lib/classData'
import { useUser, Email } from '@/lib/user'

// IMPORTANT FOR LATER: add check for lecture being accessed is in the right class

export default function TeacherLecture() {
    const router = useRouter()
    const user = useUser()
    const { id } = router.query
    const [lec, setLec] = useState<Lecture>()
    const [students, setStudents] = useState<number>(0)

    // fetch list of lectures with react-query
    const { status, data, error, isFetching } = useQuery({
        queryKey: ['teacherClasses', id],
        queryFn: async ({ queryKey }) => {
            const [_, cid] = queryKey
            console.log(cid)
            if(cid===undefined) return
            const res = await axios.get("/api/lectures", { params: { id: cid } })
            console.log(res)
            setLec(res.data)
            return res.data
        }
    })

    const socket = io("ws://localhost:8080", {
        transports: ["websocket"]
    })

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    socket.on("studentJoins", num => setStudents(num))
    socket.on("studentLeaves", num => setStudents(num))

    const closeRoom = async () => {
        if(user.state!=="hasData") return
        console.log("lectureID: ", lec?.Id)
        console.log("classid: ", lec?.ClassID)
        socket.emit("deleteRoom", user.data.email, lec?.Id)
        const req: StartLectureData = { lecture: lec?.Id!, start: true }
        const res = await axios.post("/api/lectures/start", req)
        router.push(`/teacher/${lec?.Id!}`)
    }

    // select the desired lecture based on the ID fetched from the route
    useEffect(() => {
        console.log("RUNNING THIS SHIT PLS")
        if(status==='success'&&user.state==="hasData") {
            console.log("GETTING IN PLS")
            console.log(data)
            console.log("lec: ", lec)
            console.log("lectureID: ", data.Id)
            console.log("classid: ", data.ClassID)
            socket.emit("createRoom", user.data.email, data.Id, data.ClassID)
        }
    }, [status, user.state])


    if(status==="loading") return <div>LOADING</div>
    if(status==='error') return <div>error</div>
    
    return (
        <>
            <p>{students}</p>
            <button onClick={closeRoom}>Close Room</button>
        </>
    )
    // NOTES: events to emit - createRoom, deleteRoom, for student: joinRoom leaveRoom (with notes UI)
    // render a list of people in the meeting and change when receiving a leave or join room

}