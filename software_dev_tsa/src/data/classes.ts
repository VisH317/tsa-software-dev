import axios from "axios"
import { atom, useAtom } from "jotai"
import user, { User } from "./user"
import { useEffect, useState } from "react"
import { atomsWithQuery } from "jotai-tanstack-query"


export interface Classes {
    id: string
    name: string
    teacher: string
    students: string[]
}

const classesCore = atom<Classes[]|[]>([])

// export const classes = atom(
//     get => get(classesCore),
//     async (get, set, user: User | {}) => {
//         const res = await axios.get("/api/classes", { params: { user } })
//         console.log("Classes: ",res)
//         set(classesCore, res.data)
//     }
// )

const classID = atom(1)

const classes = atomsWithQuery(get => ({
    queryKey: ["classes", get(user[0]).id],
    queryFn: async ({ queryKey: [,id] }) => {
        const res = await fetch("/api/classes" + new URLSearchParams({ user: String(id) }))
        const data = res.json()
        return data
    }
}))

export const createClass = async (name: string, teacher: string, students: string[]): Promise<void> => {
    await axios.post("http://localhost:3000/api/classes", { name, teacher, students }) 
}


// export default function useClasses(user: User | {}) {
//     const [loading, setLoading] = useState(false)
//     const [c, setC] = useAtom(classes)

//     async function getClasses() {await setC(user)}

//     useEffect(() => {
//         setLoading(true)
//         getClasses()
//         setLoading(false)
//     }, [])


//     return { c, loading }
// }

export default classes