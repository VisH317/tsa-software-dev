import React from "react";
import { useUser } from "@/data/user";
import useClasses from "@/data/classes";

export default function NewClass() {
    const [user, loadingUser] = useUser(true)
    const { c, loading } = useClasses(user)

    if(loadingUser==="pending" || loading) return <div>LOADING</div>
}