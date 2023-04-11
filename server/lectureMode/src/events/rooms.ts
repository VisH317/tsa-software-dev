import type { Socket } from "socket.io"
import type { Note, Lecture, LecturePersist } from "../types"

import { checkTeacher, checkStudent } from "../middleware"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../serverconfig"
import axios from "axios"


export default (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, client): void => {
    socket.on("createRoom", async (userEmail: string, lectureID: number, classroomID: number, name: string, description: string) => {
        if(!await checkTeacher(socket, userEmail, classroomID)) return

        await client.hSet(`classroom:lectures:${lectureID}`, { teacher: userEmail, studentCount: 0, socketID: socket.id, classroomID  })
        socket.join(String(lectureID))
    })


    socket.on("deleteRoom", async (userEmail: string, lectureID: number) => {
        const classroomID = await client.hGet(`classroom:lectures:${lectureID}`, "classroomID")
        if(!await checkTeacher(socket, userEmail, classroomID)) return

        await client.hDel(`classroom:lectures`, lectureID)
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