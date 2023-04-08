import React from 'react'
import { Classes } from '@/lib/classes'
import { Class } from '@mui/icons-material'
import Link from 'next/link'

import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'

export interface ClassesListProps {
    classes: Classes[]
}

export default function ClassesList(props: ClassesListProps) {

    const { classes } = props

    console.log("classes: ", classes)
    const router = useRouter()
    const reroute = (path: string) => {
        router.push("/teacher/"+path)
    }

    const mapClasses = () => {
        return classes.map((c: any) => (
            <Link href={"/teacher/"+String(c.Id)}>
            <Box sx={{width: "100%", position: "relative", border: "1px solid black"}}>
                <Typography variant='h1'>{c.Nm}</Typography>
                <Typography variant='body2'><em>{c.Teacher}</em></Typography>
            </Box>
            </Link>
        ))
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            {mapClasses()}
        </Box>
    )
}