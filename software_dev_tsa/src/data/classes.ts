import axios from "axios"
import { atom, useAtom } from "jotai"
import { User } from "./user"
import { useEffect, useState } from "react"


interface Classes {
    id: string
    name: string
    teacher: string
    students: string[]
}

const classesCore = atom<Classes[]|[]>([])

export const classes = atom(
    get => get(classesCore),
    async (get, set, user: User | {}) => {
        const res = await axios.get("/api/classes", { params: { user } })
        set(classesCore, res.data)
    }
)



export const createClass = async (name: string, teacher: string, students: string[]): Promise<void> => {
    await axios.post("http://localhost:3000/api/classes", { name, teacher, students }) 
}



export default function useClasses(user: User | {}) {
    const [loading, setLoading] = useState(false)
    const [c, setC] = useAtom(classes)

    async function getClasses() {await setC(user)}

    useEffect(() => {
        setLoading(true)
        getClasses()
        setLoading(false)
    }, [])

    return [c, loading]
}