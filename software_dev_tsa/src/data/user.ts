import axios from 'axios'
import { Atom, atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export interface User {
    provider: string
    username: string
    googleId: string
    password: string
    email: string
}

const userCore = atom<User | {}>({})

const user = atom((get) => get(userCore), async (get, set) => { 
    const res = await axios.get("http://localhost:3000/auth/current_user")
    set(userCore, res.data)
})

// login/signup post api functions
export const loginLocal = async (email: string, password: string): Promise<void> => {
    await axios.post("/auth/local", { email, password })
}

export const signUp = async (username: string, email: string, password: string): Promise<void> => {
    await axios.post("http://localhost:5000/auth/signup", { username, email, password })
}

// signed in check helper function
const checkSignedIn = async(u: User | {}): Promise<boolean> => {
    console.log(u)
    console.log(Object.keys(user.read))
    if(Object.keys(user.read).length!==0) return true
    const res = await axios.get("/auth/current_user")
    console.log("User: ", res.data)
    if(Object.keys(res.data).length===0) return false
    return true
}

// hook to reroute if not signed in
export function useUser(c: boolean, path: string = "/") {
    const [u, setu] = useAtom(user)
    const router = useRouter()
    const [loading, setLoading] = useState("false")

    useEffect(() => {
        async function check(u: User | {}) {
            setLoading("pending")
            const isSignedIn: boolean = await checkSignedIn(u)
            console.log(isSignedIn)
            if(!isSignedIn) router.push(path)
            setLoading("complete")
        }
        setu()
        console.log("called")
        if(c) check(u)
    }, [])

    return [u, loading]
}


export default user