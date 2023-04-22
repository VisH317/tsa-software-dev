import React, { useState } from 'react'
import { Lecture, CreateLectureData, StartLectureData } from '@/lib/classData'
import { Box, Typography, IconButton, Tooltip, TextField, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import colors from '@/styles/colors';
import Modal from '../Modal/Modal';
import axios from 'axios';
import { setTokenSourceMapRange } from 'typescript';
import { useRouter } from 'next/router';
import { montserrat } from '@/styles/fonts';

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
        return lectures.map((l: Lecture) => {
            // const disabled: boolean = l.Isstopped
            return (
                // <Box key={l.Id} sx={{backgroundColor: l.Isstopped ? "transparent" : "green"}}>
                //     <Typography variant="h1">{l.Name}</Typography>
                //     <Typography>{l.Description}</Typography>
                //     <Typography>{l.Isstopped ? "stopped" : "started"}</Typography>
                //     {!l.Isstopped && <Button variant="contained" onClick={() => joinLectureHandler(l.Id)}>Join Lecture</Button>}
                // </Box>
                <div key={l.Id} className={`${montserrat.variable} font-sans p-10 border-slate-200 border-2 hover:bg-slate-100 rounded-lg duration-300 relative w-[15%] aspect-[4/3]`}>
                    <p className="text-5xl text-slate-700 font-normal">{l.Name}</p>
                    <div className='h-4'/>
                    <p className="text-md text-slate-500">{l.Description}</p>
                    <div className='h-2'/>
                    <p className="text-lg text-slate-400">{l.Isstopped ? "stopped" : "started"}</p>
                    <div className='absolute bottom-0 left-0 w-full bg-slate-100 py-3 px-5 flex flex-row gap-5 justify-end'>
                        <button disabled={l.Isstopped} className='bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed px-3 py-2 text-white font-medium rounded-lg border-slate-100 border-4 enabled:hover:-translate-y-1 enabled:hover:border-green-200 enabled:hover:bg-green-500 duration-300' onClick={() => joinLectureHandler(l.Id)}>Open Lecture</button>
                        {/* <button className="bg-red-500 px-3 py-2 text-white font-medium rounded-lg border-slate-100 border-4 hover:-translate-y-1 hover:border-red-100 hover:bg-red-400 duration-300" onClick={() => deleteLectureHandler(l.Id)}>Delete Lecture</button> */}
                    </div>
                </div>
            )
        })
    }

    const joinLectureHandler = async (lid: number): Promise<void> => {
        router.push(`/student/lecture/${lid}`)
    }

    return (
        <div className={`font-sans ${montserrat.variable}`}>
            <p className="text-7xl text-slate-800">Current Lectures</p>
            <div className="h-16"/>
            <div className="flex flex-row flex-wrap">
                {mapLectures()}
            </div>
        </div>
    )
}