import type { Socket } from "socket.io"

import { checkTeacher, checkStudent } from "../middleware"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../serverconfig"


export default (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, client): void => {
    socket.on("createRoom", async (userEmail: string, classroomID: string) => {
        if(!await checkTeacher(socket, userEmail, classroomID)) return

        await client.hSet(`classroom:lectures:${classroomID}`, { teacher: userEmail, studentCount: 0, socketID: socket.id })
        socket.join(classroomID)
    })

    socket.on("deleteRoom", async (userEmail: string, classroomID: string) => {
        if(!await checkTeacher(socket, userEmail, classroomID)) return

        await client.hDel(`classroom:lectures`, classroomID)
        socket.to(classroomID).emit("roomClosed")
        socket.leave(classroomID)
    })

    socket.on("joinRoom", async(userEmail: string, classroomID: string) => {
        // check if student
        if(!await checkStudent(socket, userEmail, classroomID)) return


        await client.hIncrBy(`classroom:lectures:${classroomID}`, 'studentCount', 1)
        socket.join(classroomID)
    })

    socket.on("leaveRoom", async (userEmail: string, classroomID: string, notes: string) => {
        if(!await checkStudent(socket, userEmail, classroomID)) return


        await client.hIncrBy(`classroom:lectures:${classroomID}`, 'studentCount', -1)
        socket.leave(classroomID)
        // save the notes to the database
    })
}