import axios from "axios"
import type { Socket } from "socket.io"
import { Classroom } from "./types.js"
import { ClientToServerEvents, ServerToClientEvents, SocketData, InterServerEvents } from "./serverconfig.js"

export const checkTeacher = async (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, userEmail, classroomID): Promise<boolean> => {
    const res = await axios.get(`http://localhost:5001/api/classes/id?id=${classroomID}`)
    console.log(res.data, ", ", userEmail)
    console.log(res.data.teacher===userEmail)
    if(res.data.Teacher!==userEmail) {
        socket.emit("unauthorized")
        return false
    }
    return true
}

export const checkStudent = async (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, userEmail, classroomID): Promise<boolean> => {
    const { data } = await axios.get(`http://localhost:5001/api/classes/id?id=${classroomID}`)
    console.log(data)
    if(!data.Students.includes(userEmail)) {
        socket.emit("unauthorized")
        return false
    }
    return true
}