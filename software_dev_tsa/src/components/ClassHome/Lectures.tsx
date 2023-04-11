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

export default function LecturesHome(props: LecturesProps) {
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
                    <Button variant="contained" onClick={() => startLectureHandler(l.Id, false)}>{l.Isstopped ? "Start lecture" : "Open Lecture"}</Button>
                    <Button variant="contained" onClick={() => deleteLectureHandler(l.Id)}>Delete Lecture</Button>
                </Box>
            )
        })
    }

    const createLectureHandler = async (): Promise<void> => {
        const lect: CreateLectureData = { name, description: desc, classID }
        const res = await axios.post("/api/lectures", lect)
        setOpen(false)
        alert("Lecture created!")
    }

    const deleteLectureHandler = async (lid: number): Promise<void> => {
        const res = await axios.delete("/api/lectures", {params: {lecture: lid}})
        setOpen(false)
    }

    const startLectureHandler = async (lid: number, start: boolean): Promise<void> => {
        console.log(start)
        const req: StartLectureData = { lecture: lid, start }
        const res = await axios.post("/api/lectures/start", req)
        setOpen(false)
        router.push(`/teacher/lecture/${lid}`)
    }

    return (
        <Box sx={{width: "100%", height: "100%"}}>
            {mapLectures()}
            <Tooltip placement="left" title="New Lecture" arrow>
                <IconButton sx={{backgroundColor: colors.main, color: colors.white, position: "fixed", bottom: "5%", right: "4%", boxShadow: "2px 2px 6px #777", "&:hover": {boxShadow: "0", backgroundColor: colors.light}}} onClick={() => setOpen(true)}>
                    <AddIcon fontSize="large" sx={{fontSize: "60px",}}/>
                </IconButton>
            </Tooltip>
            <Modal open={open} close={() => setOpen(false)}>
                <form onSubmit={createLectureHandler}>
                    <TextField placeholder="Lecture Name: " value={name} onChange={e => setName(e.target.value)}/>
                    <TextField placeholder="Lecture Description: " value={desc} onChange={e => setDesc(e.target.value)}/>
                    <Button variant="contained" type="submit">Submit</Button>
                </form>
            </Modal>
        </Box>
    )
}