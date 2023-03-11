import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./serverconfig"
import initRedis from "./redis"

// event handler imports
import rooms from "./events/rooms"
import questions from "./events/questions"

// socket server interfaces

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(8080)

const client = await initRedis()

// create redis index (basically schema for storing the lecture sessions)

io.on('connection', function (socket) {
    console.log("socket connection made")

    rooms(socket, client)

    // question creation

    questions(io, socket, client)

    // TODOS: handlers for student asking questions, handler for teacher asking question, handler for adding materials (text for now)
    // Analysis updates
})

// First: create event to create a lecture room 
