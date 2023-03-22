import axios from "axios"
import { atom } from "jotai"

interface Classes {
    id: string
    name: string
    teacher: string
    students: string[]
}

const classesCore = atom<Classes[]|[]>([])

const classes = atom(
    get => get(classesCore),
    async (get, set, action) => {
        const res = await axios.get("/api/classes")
        set(classesCore, res.data)
    }
)

export const createClass = async (name: string, teacher: string, students: string[]): Promise<void> => {
    await axios.post("http://localhost:3000/api/classes", { name, teacher, students }) 
}

export default classes