import axios from "axios"
import { atom, useAtom, Atom } from "jotai"
import user, { User } from "./user"
import { useEffect, useState } from "react"
import { atomsWithQuery } from "jotai-tanstack-query"
import { loadable } from "jotai/utils"


export interface Classes {
    id: string
    name: string
    teacher: string
    students: string[]
}


export const classes: Atom<Promise<User>> = atom<Promise<User>>(
    async (get): Promise<User> => {
        const u = await get(user)
        console.log(u)
        const res = await axios.get("/api/classes", { params: { user: u.email } });
        return res.data
    }
)

// const classID = atom(1)

// const classes = atomsWithQuery(get => ({
//     queryKey: ["classes", get(user[0]).id],
//     queryFn: async ({ queryKey: [,id] }) => {
//         const res = await axios.get("http://localhost:3000/api/classes", {params: { user: id }})
//         return res.data
//     }
// }))

export const studentClasses = atom(
    async get => {
        const u = await get(user)
        const res = await axios.get("/api/classes/bystud", { params: { user: u.email } })
        return res.data
    },
)

export const createClass = async (name: string, teacher: string, students: string[] = []): Promise<void> => {
    await axios.post("/api/classes", { nm: name, teacher, students }) 
}

// export const joinClass = async (name: string, class: number): Promise<void> => {
//     await axios.post("/api/classes", { name, teacher }) 
// }

export const joinClass = async (cls: number, student: string | null): Promise<void> => {
    await axios.post("/api/classes/students", {
        stud: student,
        class: cls
    })
}

const loadableClasses = loadable(classes)
const loadableStudentClasses = loadable(studentClasses)

export function useClasses() {
    const [c] = useAtom(loadableClasses)
    const [sc] = useAtom(loadableStudentClasses)

    return [c, sc]
}

export default classes