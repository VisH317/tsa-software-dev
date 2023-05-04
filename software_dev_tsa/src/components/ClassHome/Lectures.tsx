import React, { useEffect, useState } from 'react'
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

export default function LecturesHome(props: LecturesProps) {
    const { lectures, classID } = props
    const [open, setOpen] = useState<boolean>(false)

    // new lecture form states
    const [name, setName] = useState<string>("")
    const [desc, setDesc] = useState<string>("")
    const [disabled, setDisabled] = useState<boolean>(false)

    useEffect(() => {
        if(name.length===0 || desc.length===0) setDisabled(true)
        else setDisabled(false)
    }, [name, desc])

    const router = useRouter()

    const mapLectures = (): React.ReactNode => {
        if(lectures.length===0) return <div className={`${montserrat.variable} font-sans text-2xl text-slate-500`}>You currently have no previous or ongoing lectures</div>
        return lectures.map(l => {
            return (
                <div key={l.Id} className={`${montserrat.variable} font-sans p-10 border-slate-200 border-2 hover:bg-slate-100 rounded-lg duration-300 relative w-[25%] aspect-[4/3]`}>
                    <p className="text-5xl text-slate-700 font-normal">{l.Name}</p>
                    <div className='h-4'/>
                    <p className="text-md text-slate-500">{l.Description}</p>
                    <div className='h-2'/>
                    <p className="text-lg text-slate-400">{l.Isstopped ? "stopped" : "started"}</p>
                    <div className='absolute bottom-0 left-0 w-full bg-slate-100 py-3 px-5 flex flex-row gap-5 justify-end'>
                        <button className={`${l.Isstopped ? "bg-slate-800" : "bg-green-500"} px-3 py-2 text-white font-medium rounded-lg border-slate-100 border-4 hover:-translate-y-1 hover:border-green-200 hover:${l.Isstopped ? "bg-green-500" : "bg-green-400"} duration-300`} onClick={() => startLectureHandler(l.Id, false)}>{l.Isstopped ? "Start lecture" : "Open Lecture"}</button>
                        <button className="bg-red-500 px-3 py-2 text-white font-medium rounded-lg border-slate-100 border-4 hover:-translate-y-1 hover:border-red-100 hover:bg-red-400 duration-300" onClick={() => deleteLectureHandler(l.Id)}>Delete Lecture</button>
                    </div>
                </div>
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
        <div className="p-10">
            <p className="text-7xl text-slate-800">Current Lectures</p>
            <div className="h-16"/>
            <div className="flex flex-row flex-wrap">
                {mapLectures()}
            </div>
            <Tooltip placement="left" title="New Lecture" arrow>
                <IconButton sx={{backgroundColor: colors.main, color: colors.white, position: "fixed", bottom: "5%", right: "4%", boxShadow: "2px 2px 6px #777", "&:hover": {boxShadow: "0", backgroundColor: colors.light}}} onClick={() => setOpen(true)}>
                    <AddIcon fontSize="large" sx={{fontSize: "60px",}}/>
                </IconButton>
            </Tooltip>
            <Modal open={open} close={() => setOpen(false)} height="50vh">
                <form onSubmit={createLectureHandler} className={`flex flex-col gap-5 w-full h-full justify-around items-center p-10 ${montserrat.variable} font-sans relative`}>
                    <p className="text-4xl flex-none">Create a Lecture</p>
                    <div className="h-16"/>
                    <input placeholder="Lecture Name: " value={name} onChange={e => setName(e.target.value)} className="flex-none p-5 w-[80%] border-2 rounded-lg border-slate-400 hover:border-slate-500 duration-300 focus:border-green-500"/>
                    <input placeholder="Lecture Description: " value={desc} onChange={e => setDesc(e.target.value)} className="flex-none p-5 w-[80%] border-2 rounded-lg border-slate-400 hover:border-slate-500 duration-300 focus:border-green-500"/>
                    <div className="grow flex justify-center items-center w-full">
                        <button disabled={disabled} className={`bg-green-500 px-5 py-3 text-xl text-white font-sans ${montserrat.variable} disabled:bg-slate-200 disabled:cursor-not-allowed duration-300 enabled:hover:-translate-y-1 enabled:hover:bg-green-500 border-4 border-white enabled:hover:border-green-200 rounded-lg`}>Create Lecture</button>
                        
                    </div>
                </form>
            </Modal>
        </div>
    )
}