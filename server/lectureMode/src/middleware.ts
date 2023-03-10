import axios from "axios"
import type { Socket } from "socket.io"
import { Classroom } from "./types"
import { ClientToServerEvents, ServerToClientEvents, SocketData, InterServerEvents } from "./serverconfig"

export const checkTeacher = async (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, userEmail, classroomID): Promise<boolean> => {
    const res: Classroom = await axios.get(`http://localhost:5000/api/classes/id?id=${classroomID}`)
    if(res.teacher!=userEmail) {
        socket.emit("unauthorized")
        return false
    }
    return true
}

export const checkStudent = async (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, userEmail, classroomID): Promise<boolean> => {
    const res: Classroom = await axios.get(`http://localhost:5000/api/classes/id?id=${classroomID}`)
    if(!res.students.includes(userEmail)) {
        socket.emit("unauthorized")
        return false
    }
    return true
}