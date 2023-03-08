import axios from "axios"
import { Classroom } from "./types"

export const checkTeacher = async (userEmail, classroomID): Promise<boolean> => {
    const res: Classroom = await axios.get(`http://localhost:5000/api/classes/id?id=${classroomID}`)
    if(res.teacher!=userEmail) {
        //socket.emit("unauthorized")
        return false
    }
    return true
}

export const checkStudent = async (userEmail, classroomID): Promise<boolean> => {
    const res: Classroom = await axios.get(`http://localhost:5000/api/classes/id?id=${classroomID}`)
    if(!res.students.includes(userEmail)) {
        //socket.emit("unauthorized")
        return false
    }
    return true
}