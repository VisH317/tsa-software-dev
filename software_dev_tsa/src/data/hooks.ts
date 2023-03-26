import user from "./user";
import classes from "./classes";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useUserAndClasses = () => {
    const us = useAtom(user[0])
    const usStatus = useAtom(user[1])
    const cls = useAtom(classes[0])
    const clsStatus = useAtom(classes[1])
    const router = useRouter()

    useEffect(() => {
        if(Object.keys(us).length===0) router.push("/")
    }, [])

    return [us, usStatus, cls, clsStatus]
} 

export default useUserAndClasses