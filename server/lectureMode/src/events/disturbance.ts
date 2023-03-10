import type { Socket, Server } from "socket.io"
import type { Lecture } from "../types"

import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../serverconfig"
import { checkStudent, checkTeacher } from "../middleware"
import { convertToLectureType } from "../redis"
import axios from "axios"

export default (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, client): void => {
    socket.on("checkDisturbance", async(userEmail: string, classroomID: string) => {
        if(!await checkStudent(socket, userEmail, classroomID)) return

        const res = await client.hGetAll(`classroom:lectures${classroomID}`)
        const lecture: Lecture = convertToLectureType(res)

        io.sockets[lecture.socketID].emit("sendDisturbance")
    })
}