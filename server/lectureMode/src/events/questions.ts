//types
import type { Server, Socket } from "socket.io"
import type { Lecture } from "../types"

// imports
import { checkStudent, checkTeacher } from "../middleware.js"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../serverconfig.js"
import { convertToLectureType } from "../redis.js"


export default (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, client): void => {
    socket.on("createTeacherQuestion", async (userEmail: string, lectureID: number, questionPrompt: string) => {
        const classroomID = await client.hGet(`lectures:${lectureID}`, "classroomID")
        if(!await checkTeacher(socket, userEmail, classroomID)) return
        
        socket.to(String(lectureID)).emit("receiveTeacherQuestion", questionPrompt)
        //io.sockets[lecture.socketID].emit("sendTeacherQuestion", questionPrompt)
    })

    
    socket.on("answerTeacherQuestion", async (userEmail: string, lectureID: number, questionAnswer: string, question: string) => {
        const classroomID = await client.hGet(`lectures:${lectureID}`, "classroomID")
        if(!await checkStudent(socket, userEmail, classroomID)) return

        const socketID = await client.hGet(`lectures:${lectureID}`, "socketID")
        
        io.to(socketID).emit("sendTeacherQuestionResponse", userEmail, questionAnswer, question)
    })


    socket.on("createStudentQuestion", async (userEmail: string, lectureID: number, questionPrompt: string) => {
        console.log("creating student question")
        const classroomID = await client.hGet(`lectures:${lectureID}`, "classroomID")
        if(!await checkStudent(socket, userEmail, classroomID)) return

        const socketID = await client.hGet(`lectures:${lectureID}`, "socketID")
        console.log("socketID: ",socketID)

        console.log("available sockets: ", io.sockets)
        io.to(socketID).emit("receiveStudentQuestion", userEmail, questionPrompt, socket.id)
    })


    socket.on("answerStudentQuestion", async (userEmail: string, lectureID: number, questionAnswer: string, socketID: string, question: string) => {
        const classroomID = await client.hGet(`lectures:${lectureID}`, "classroomID")
        if(!await checkTeacher(socket, userEmail, classroomID)) return

        io.to(socketID).emit("sendStudentQuestionResponse", questionAnswer, question)
    })
}