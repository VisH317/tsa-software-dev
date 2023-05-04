import type { Socket, Server } from "socket.io"
import type { Note, Lecture, LecturePersist } from "../types.js"
// import redis from 'redis'

import { checkTeacher, checkStudent } from "../middleware.js"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../serverconfig.js"
import axios from "axios"


export default (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, client): void => {
    socket.on("createRoom", async (userEmail: string, lectureID: number, classroomID: number) => {
        console.log("Stuff: ", userEmail, ", ", lectureID, ", ", classroomID)
        // if(!await checkTeacher(socket, userEmail, classroomID)) return

        console.log("creating room!!")
        await client.hSet(`lectures:${lectureID}`, { teacher: userEmail, studentCount: 0, socketID: socket.id, classroomID })
        const res = await client.hGetAll(`lectures:${lectureID}`)

        console.log("res: ",res)
        socket.join(String(lectureID))
    })


    socket.on("deleteRoom", async (userEmail: string, lectureID: number) => {
        const classroomID = await client.hGet(`lectures:${lectureID}`, "classroomID")
        console.log("classroomID: ", classroomID)
        // if(!await checkTeacher(socket, userEmail, classroomID)) return

        console.log("deleting room!!")
        await client.hDel(`lectures`, String(lectureID))
        const test = await client.hGetAll(`lectures`, String(lectureID))

        console.log("mytest: ", test)
        socket.to(String(lectureID)).emit("roomClosed")
        socket.leave(String(lectureID))
    })


    socket.on("joinRoom", async(userEmail: string, lectureID: number) => {
        console.log("joiningroom!")
        const classroomID = await client.hGet(`lectures:${lectureID}`, "classroomID")
        // if(!await checkStudent(socket, userEmail, classroomID)) return

        await client.hIncrBy(`lectures:${lectureID}`, 'studentCount', 1)
        const num = await client.hGet(`lectures:${lectureID}`, "studentCount") // later: show the student's emails by managing the list of people on the teacher's end and making a socket request there and back to reroute back to the person when joining or store on database and get as request
        socket.join(String(lectureID))
        console.log("sending feedback event...")
        socket.to(String(lectureID)).emit("studentJoins", num)

        const socketID: string = await client.hGet(`lectures:${lectureID}`, 'socketID')
        io.to(socketID).emit("sendJoin", userEmail)
    })


    socket.on("leaveRoom", async (userEmail: string,lectureID: number, title: string, content: string) => {
        console.log("leavingroom!!")
        const classroomID = await client.hGet(`lectures:${lectureID}`, "classroomID")
        // if(!await checkStudent(socket, userEmail, classroomID)) return

        await client.hIncrBy(`lectures:${lectureID}`, 'studentCount', -1)
        const num = await client.hGet(`lectures:${lectureID}`, 'studentCount')
        console.log("num!!: ", num)
        socket.to(String(lectureID)).emit("studentLeaves", num)

        const socketID: string = await client.hGet(`lectures:${lectureID}`, 'socketID')
        io.to(socketID).emit("sendDisturbance", userEmail)

        socket.leave(String(lectureID))
        console.log("note: ", content)
        const note: Note = {
            lectureID,
            studentEmail: userEmail,
            title,
            content
        }

        // save the notes to the database
        await axios.post("http://localhost:5001/api/notes", note)
    })
}