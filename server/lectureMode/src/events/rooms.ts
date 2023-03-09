import type { Socket } from "socket.io"
import type { Note, Lecture, LecturePersist } from "../types"

import { checkTeacher, checkStudent } from "../middleware"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../serverconfig"
import axios from "axios"


export default (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, client): void => {
    socket.on("createRoom", async (userEmail: string, classroomID: string, name: string, description: string) => {
        if(!await checkTeacher(socket, userEmail, classroomID)) return

        await client.hSet(`classroom:lectures:${classroomID}`, { teacher: userEmail, studentCount: 0, socketID: socket.id })
        socket.join(classroomID)

        const lecture: LecturePersist = {
            classID: parseInt(classroomID),
            name,
            description
        }

        await axios.post("http://localhost:3000/api/lectures", lecture)
    })


    socket.on("deleteRoom", async (userEmail: string, classroomID: string) => {
        if(!await checkTeacher(socket, userEmail, classroomID)) return

        await client.hDel(`classroom:lectures`, classroomID)
        socket.to(classroomID).emit("roomClosed")
        socket.leave(classroomID)
    })


    socket.on("joinRoom", async(userEmail: string, classroomID: string) => {
        if(!await checkStudent(socket, userEmail, classroomID)) return

        await client.hIncrBy(`classroom:lectures:${classroomID}`, 'studentCount', 1)
        socket.join(classroomID)
    })


    socket.on("leaveRoom", async (userEmail: string, classroomID: string, notes: Note) => {
        if(!await checkStudent(socket, userEmail, classroomID)) return

        await client.hIncrBy(`classroom:lectures:${classroomID}`, 'studentCount', -1)
        socket.leave(classroomID)

        const note: Note = {
            // unfinished
        }

        // save the notes to the database
        await axios.post("http://localhost:3000/api/notes", {

        })
    })
}