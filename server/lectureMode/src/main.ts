import { Server } from "socket.io"
import { createClient, SchemaFieldTypes } from "redis"
import { randomUUID } from "crypto"
import axios from 'axios'

const client = createClient()

await client.connect()

// server interfaces

interface ServerToClientEvents {
    roomClosed: () => void,
}

interface ClientToServerEvents {
    // room management
    createRoom: (userID: string, classroomID: string) => void,
    deleteRoom: (userID: string, classroomID: string) => void,
    joinRoom: (userID: string, classroomID: string) => void,
    leaveRoom: (userID: string, classroomID: string, notes: string) => void,

    // teacher questions
    createTeacherQuestion: (userID: string, classroomID: string, questionPrompt: string) => void,
    answerTeacherQuestion: (userID: string, userName: string, classroomID, string, questionAnswer: string) => void,

    // student questions
    createStudentQuestion: (userID: string, classroomID: string, questionPrompt: string) => void,
    answerStudentQuestion: (userID: string, classroomID: string, questionAnswer: string) => void
}

interface InterServerEvents {}

interface SocketData {}

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(8080)

// create redis index
try {
    await client.ft.create('idx:lectures', {
        teacher: SchemaFieldTypes.TEXT,
        studentCount: SchemaFieldTypes.NUMERIC,
        socketID: SchemaFieldTypes.TEXT
    }, {
        ON: "HASH",
        PREFIX: "classroom:lectures"
    })
} catch (e) { console.log(e) }


io.on('connection', function (socket) {
    console.log("socket connection made")

    socket.on("createRoom", async (userID: string, classroomID: string) => {
        // check if teacher
        // create classroom lecture record
        const res = await axios.get(`http://localhost:5000/api/classes/id?id=${classroomID}`)
        await client.hSet(`classroom:lectures:${classroomID}`, { teacher: userID, studentCount: 0, socketID: socket.id })
        socket.join(classroomID)
    })

    socket.on("deleteRoom", async (userID: string, classroomID: string) => {
        await client.hDel(`classroom:lectures`, classroomID)
        socket.to(classroomID).emit("roomClosed")
        socket.leave(classroomID)
    })

    socket.on("joinRoom", async(userID: string, classroomID: string) => {
        // check if student
        await client.hIncrBy(`classroom:lectures:${classroomID}`, 'studentCount', 1)
        socket.join(classroomID)
    })

    socket.on("leaveRoom", async (userID: string, classroomID: string, notes: string) => {
            await client.hIncrBy(`classroom:elctures:${classroomID}`, 'studentCount', -1)
            socket.leave(classroomID)
            // save the notes to the database
        }
    )

    // question creation

    socket.on()

    // TODOS: handlers for student asking questions, handler for teacher asking question, handler for adding materials (text for now)
    // Analysis updates
})

// First: create event to create a lecture room 
