import React, { useState } from 'react'
import { Lecture, CreateLectureData, StartLectureData } from '@/lib/classData'
import { Box, Typography, IconButton, Tooltip, TextField, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import colors from '@/styles/colors';
import Modal from '../Modal/Modal';
import axios from 'axios';
import { setTokenSourceMapRange } from 'typescript';
import { useRouter } from 'next/router';

interface LecturesProps {
    lectures: Lecture[],
    classID: number
}

export default function StudentLecturesHome(props: LecturesProps) {
    const { lectures, classID } = props
    const [open, setOpen] = useState<boolean>(false)

    // new lecture form states
    const [name, setName] = useState<string>("")
    const [desc, setDesc] = useState<string>("")

    const router = useRouter()

    const mapLectures = (): React.ReactNode => {
        if(lectures.length===0) return <Box>You currently have no previous or ongoing lectures</Box>
        return lectures.map(l => {
            return (
                <Box key={l.Id} sx={{backgroundColor: l.Isstopped ? "transparent" : "green"}}>
                    <Typography variant="h1">{l.Name}</Typography>
                    <Typography>{l.Description}</Typography>
                    <Typography>{l.Isstopped ? "stopped" : "started"}</Typography>
                    <Button variant="contained" onClick={() => joinLectureHandler(l.Id, false)}>{l.Isstopped ? "Start lecture" : "Open Lecture"}</Button>
                </Box>
            )
        })
    }

    // const startLectureHandler = async (lid: number, start: boolean): Promise<void> => {
    //     console.log(start)
    //     const req: StartLectureData = { lecture: lid, start }
    //     const res = await axios.post("/api/lectures/start", req)
    //     setOpen(false)
    //     router.push(`/student/lecture/${lid}`)
    // }

    return (
        <Box sx={{width: "100%", height: "100%"}}>
            {mapLectures()}
        </Box>
    )
}