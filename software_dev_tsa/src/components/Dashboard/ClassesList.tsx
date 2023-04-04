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
            <Box sx={{width: "10%", height: '10%'}}>
                <Typography variant='h1'>{c.name}</Typography>
                <Typography variant='body2'><em>{c.teacher}</em></Typography>
            </Box>
        ))
    }

    return (
        <Box sx={{width: "100%", height: "100%"}}>
            <p>BRUH</p>
            {classes!==null ? mapClasses() : <div>BRUH</div>}
        </Box>
    )
}