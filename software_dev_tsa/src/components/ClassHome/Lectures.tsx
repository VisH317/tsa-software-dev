import React from 'react'
import { Lecture } from '@/lib/classData'
import { Box, Typography } from '@mui/material'

interface LecturesProps {
    lectures: Lecture[]
}

export default function LecturesHome(props: LecturesProps) {
    const { lectures } = props

    const mapLectures = () => {
        return lectures.map(l => {
            return (
                <Box key={l.Id}>
                    <Typography variant="h1">{l.Name}</Typography>
                    <Typography>{l.Isstopped}</Typography>
                </Box>
            )
        })
    }

    return (
        <Box>
            {mapLectures()}
        </Box>
    )
}