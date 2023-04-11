import axios from 'axios'
import { Atom, atom, useAtom } from 'jotai'
import { loadable, useHydrateAtoms } from 'jotai/utils'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { atomsWithQuery } from 'jotai-tanstack-query'

export interface User {
    provider: string
    username: string
    googleId: string
    password: string
    email: string
}

// const user = atom(get => ({
//     queryKey: ['users'],
//     queryFn: async () => {
//         const res = await axios.get("http://localhost:3000/auth/current_user")
//         return res.data
//     },
// }))

const user: Atom<Promise<User>> = atom<Promise<User>>(async (get): Promise<User> => {
    const res = await axios.get("http://localhost:3000/auth/current_user")
    return res.data
})

// login/signup post api functions
export const loginLocal = async (email: string, password: string): Promise<void> => {
    await axios.post("/auth/local", { email, password })
}

export const signUp = async (username: string, email: string, password: string): Promise<void> => {
    await axios.post("http://localhost:3000/auth/signup", { username, email, password })
}

// signed in check helper function
const checkSignedIn = (u: User | {}): boolean => {
    console.log(u)
    console.log(Object.keys(user.read))
    if(Object.keys(user.read).length!==0) return true
    // const res = await axios.get("/auth/current_user")
    // console.log("User: ", res.data)
    // if(Object.keys(res.data).length===0) return false
    return false
}

// hook to reroute if not signed in

const loadableUser = loadable(user)

export type Email = `${string}@${string}.${string}`

export function useUser(path: string = "/") {
    const [u] = useAtom(loadableUser)
    const router = useRouter()

    // useEffect(() => {
    //     const isSignedIn: boolean = checkSignedIn(u)
    //     if(!isSignedIn) router.push(path)
    //     console.log("called")
    // }, [u.state])

    return u
}


export default user