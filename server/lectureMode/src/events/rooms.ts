import type { Socket } from "socket.io"
import type { Note, Lecture, LecturePersist } from "../types.js"
// import redis from 'redis'

import { checkTeacher, checkStudent } from "../middleware.js"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../serverconfig.js"
import axios from "axios"


export default (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, client): void => {
    socket.on("createRoom", async (userEmail: string, lectureID: number, classroomID: number) => {
        console.log("Stuff: ", userEmail, ", ", lectureID, ", ", classroomID)
        if(!await checkTeacher(socket, userEmail, classroomID)) return
        console.log("creating room!!")
        await client.hSet(`lectures:${lectureID}`, { teacher: userEmail, studentCount: 0, socketID: socket.id, classroomID })
        const res = await client.hGetAll(`lectures:${lectureID}`)
        console.log("res: ",res)
        socket.join(String(lectureID))
    })


    socket.on("deleteRoom", async (userEmail: string, lectureID: number) => {
        const classroomID = await client.hGet(`lectures:${lectureID}`, "classroomID")
        console.log("classroomID: ", classroomID)
        if(!await checkTeacher(socket, userEmail, classroomID)) return
        console.log("deleting room!!")
        await client.hDel(`lectures`, lectureID)
        socket.to(String(lectureID)).emit("roomClosed")
        socket.leave(String(lectureID))
    })


    socket.on("joinRoom", async(userEmail: string, lectureID: number) => {
        const classroomID = await client.hGet(`classroom:lectures:${lectureID}`, "classroomID")
        if(!await checkStudent(socket, userEmail, classroomID)) return

        await client.hIncrBy(`classroom:lectures:${lectureID}`, 'studentCount', 1)
        socket.join(String(lectureID))
    })


    socket.on("leaveRoom", async (userEmail: string,lectureID: number, title: string, content: string) => {
        const classroomID = await client.hGet(`classroom:lectures:${lectureID}`, "classroomID")
        if(!await checkStudent(socket, userEmail, classroomID)) return

        await client.hIncrBy(`classroom:lectures:${lectureID}`, 'studentCount', -1)
        socket.leave(String(lectureID))

        const note: Note = {
            lectureID,
            studentEmail: userEmail,
            title,
            content
        }

        // save the notes to the database
        await axios.post("http://localhost:3000/api/notes", note)
    })
}