import axios from "axios"
import { atom, useAtom } from "jotai"
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


export const classes = atom(
    async get => {
        const res = await axios.get("/api/classes", { params: { user: get(user).email } });
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
        const res = await axios.get("/api/classes/bystud", { params: { user: get(user).email } })
        return res.data
    },
)

export const createClass = async (name: string, teacher: string, students: string[] = []): Promise<void> => {
    await axios.post("/api/classes", { name, teacher, students }) 
}

const loadableClasses = loadable(classes)

export function useClasses() {
    const [c] = useAtom(loadableClasses)

    return c
}

export default classes