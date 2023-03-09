//types
import type { Server, Socket } from "socket.io"
import type { Lecture } from "../types"

// imports
import { checkStudent, checkTeacher } from "../middleware"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../serverconfig"
import { convertToLectureType } from "../redis"


export default (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, client): void => {
    socket.on("createTeacherQuestion", async (userEmail: string, classroomID: string, questionPrompt: string) => {
        if(!await checkTeacher(socket, userEmail, classroomID)) return
        
        socket.to(classroomID).emit("receiveTeacherQuestion", questionPrompt)
        //io.sockets[lecture.socketID].emit("sendTeacherQuestion", questionPrompt)
    })

    socket.on("answerTeacherQuestion", async (userEmail: string, classroomID: string, questionAnswer: string) => {
        if(!await checkStudent(socket, userEmail, classroomID)) return


        const res = await client.hGetAll(`classroom:lectures${classroomID}`)
        const lecture: Lecture = convertToLectureType(res.data)
        
        io.sockets[lecture.socketID].emit("sendTeacherQuestionResponse", questionAnswer)
    })

    socket.on("createStudentQuestion", async (userEmail: string, classroomID: string, questionPrompt: string) => {
        if(!await checkStudent(socket, userEmail, classroomID)) return

        const res = await client.hGetAll(`classroom:lectures${classroomID}`)
        const lecture: Lecture = convertToLectureType(res.data)

        io.sockets[lecture.socketID].emit("receiveStudentQuestion", questionPrompt, socket.id)
    })

    socket.on("answerStudentQuestion", async (userEmail: string, classroomID: string, questionAnswer: string, socketID: string) => {
        if(!await checkTeacher(socket, userEmail, classroomID)) return

        io.sockets[socketID].emit("sendStudentQuestionResponse", questionAnswer)
    })
}