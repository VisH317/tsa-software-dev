import React from "react";
import { useUser } from "@/data/user";
import useClasses from "@/data/classes";

export default function NewClass() {
    const [user, loading] = useUser(true)
    const [classes, loadingClasses] = useClasses(user)

    if(loading==="pending" || loadingClasses) return <div>LOADING</div>
}