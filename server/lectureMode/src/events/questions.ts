//types
import type { Socket } from "socket.io"
import type { Lecture } from "../types"

// imports
import { checkStudent, checkTeacher } from "../middleware"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../serverconfig"
import { convertToLectureType } from "../redis"


export default (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, client: RedisClientType): void => {
    socket.on("createTeacherQuestion", async (userEmail: string, classroomID: string, questionPrompt: string) => {
        const isTeacher: boolean = await checkTeacher(userEmail, classroomID)
        if(!isTeacher) {
            socket.emit('unauthorized')
            return
        }

        const res = await client.hGetAll(`classroom:lectures${classroomID}`)
        const lecture: Lecture = convertToLectureType(res)
        
    })
}