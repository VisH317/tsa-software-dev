import React, { useEffect, useState } from "react"
import Head from "next/head";
import { Box, Grid, Stack, Tooltip, Typography } from "@mui/material"
import colors from "@/styles/colors";
import { useRouter } from "next/router";
import { useUser } from "@/lib/user";
import { useClasses } from "@/lib/classes";

// styles & icons
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material'

import MiniDrawer from "@/components/Dashboard/Drawer";
import DashNav from "@/components/Dashboard/DashNav";
import ClassesList from "@/components/Dashboard/ClassesList";
import { useAtom } from "jotai";
import { montserrat } from "@/styles/fonts";
import Image from "next/image";


export default function Home() {
    const us = useUser()
    console.log("user: ", us)
    const [cls, scls] = useClasses()
    const router = useRouter()
    const handleNewClass = () => router.push("/newClass")
    if(us.state==="hasData" && us.data==="") void router.push("/")

    const [open, setOpen] = useState(false)

    console.log(scls)

    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)
    
    return us.state==="hasData" && cls.state==="hasData" && scls.state==="hasData" ? (
        <>
            <Head>
                <title>Create Next App
                </title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;700&display=swap" rel="stylesheet"/>
            </Head>
            {/* <DashNav open={open} handleDrawerOpen={handleDrawerOpen}/> */}
            <MiniDrawer open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose}>
            <div className="w-full h-full flex flex-col">
                <div className={`w-full pb-[5%] px-40 gap-5 bg-slate-900 flex justify-start ${montserrat.variable} font-sans`}>
                    <div className="w-[60%] mt-[15%]"><p className="text-6xl text-white font-medium">Welcome back, {us.data.username}!</p></div>
                    <div className="w-[40%] mt-[4%] ml-[20%]">
                        <Image src="/undraw_exams_re_4ios.svg" alt="epic image of school yayayayya" width={450} height={350}/>
                    </div>
                </div>
                    <div className={`w-full ${montserrat.variable} font-sans flex flex-row bg-slate-50 h-screen overflow-y-scroll`}>
                        <div className="w-[60%] p-10">
                            <div className={`w-full`}>
                                <p className="font-light ml-[5%] text-slate-700 text-5xl">Your Classes</p>
                                <div className="h-8"/>
                                <ClassesList classes={cls.data} isTeacher/>
                            </div>
                            <div className="h-16"/>
                            <div className={`w-full`}>
                                <p className="font-light ml-[5%] text-slate-700 text-5xl">Your Student Classes</p>
                                <div className="h-8"/>
                                <ClassesList classes={scls.data} isTeacher={false}/>
                                <div className="h-8"/>
                            </div>
                        </div>
                        <div className="w-[40%] p-10">
                            <p className="font-light ml-[5%] text-slate-700 text-5xl">Your Assignments</p>
                        </div>
                    </div>
                </div>
            </MiniDrawer>
            <Tooltip placement="left" title="New Class" arrow>
                <IconButton sx={{backgroundColor: colors.main, color: colors.white, position: "fixed", bottom: "5%", right: "4%", boxShadow: "2px 2px 6px #777", "&:hover": {boxShadow: "0", backgroundColor: colors.light}}} onClick={handleNewClass}>
                    <AddIcon fontSize="large" sx={{fontSize: "60px",}}/>
                </IconButton>
            </Tooltip>
        </>
    ) : <div>BRUH LOADING</div>
}

export function useAllAssignments() {
    
}
