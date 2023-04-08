import React from 'react'
import { Classes } from '@/lib/classes'
import { Class } from '@mui/icons-material'

import { Box, Typography } from '@mui/material'

export interface ClassesListProps {
    classes: Classes[]
}

export default function ClassesList(props: ClassesListProps) {

    const { classes } = props

    console.log("classes: ", classes)

    const mapClasses = () => {
        return classes.map((c: any) => (
            <Box sx={{width: "100%", position: "relative", border: "1px solid black"}}>
                <Typography variant='h1'>{c.Nm}</Typography>
                <Typography variant='body2'><em>{c.Teacher}</em></Typography>
            </Box>
        ))
    }

    return (
        <Box sx={{width: "95%", height: "100%", position: "relative", left: "5%", marginLeft: "25px", display: "flex", flexDirection: "column"}}>
            {mapClasses()}
        </Box>
    )
}