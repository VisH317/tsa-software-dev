import React from 'react'
import { Classes } from '@/lib/classes'
import { Class } from '@mui/icons-material'
import Link from 'next/link'

import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'

export interface ClassesListProps {
    classes: Classes[],
    isTeacher: boolean
}

export default function ClassesList(props: ClassesListProps) {

    const { classes, isTeacher } = props

    console.log("classes: ", classes)
    const router = useRouter()
    const reroute = (path: string) => {
        router.push("/teacher/"+path)
    }

    const mapClasses = () => {
        return classes.map((c: any) => ( 
            <Link href={`${isTeacher ? "/teacher/" : "/student/"}`+String(c.Id)} className="w-[25%] bg-white">
                <div className="w-full overflow-hidden rounded-lg shadow-lg aspect-[5/4] relative p-10 hover:shadow-xl duration-300 hover:-translate-y-1">
                    <div className="w-full h-[40%] bg-slate-400 absolute top-0 left-0"/>
                    <p className="text-4xl font-medium mt-[35%]">{c.Nm}</p>
                    <div className="h-[3%]"/>
                    <p>Teacher: <a href={`mailto:{c.Teacher}`} className="hover:text-green-500 duration-150">{c.Teacher}</a></p>
                </div>
            </Link>
        ))
    }

    return (
        <div className="w-full flex flex-row gap-5 flex-wrap">
            {mapClasses()}
        </div>
    )
}