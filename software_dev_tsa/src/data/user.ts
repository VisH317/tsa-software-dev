import axios from 'axios'
import { atom } from 'jotai'

interface User {
    provider: string
    username: string
    googleId: string
    password: string
    email: string
}

const userCore = atom<User | {}>({})

const user = atom((get) => get(userCore), async (get, set, action) => { 
    const res = await axios.get("http://localhost:3000/auth/current_user")
    set(userCore, res.data)
})

// login api functions
export const loginLocal = async (email: string, password: string): Promise<void> => {
    await axios.post("/auth/local", { email, password })
}


export default user