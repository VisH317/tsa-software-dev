import React, { useState, useEffect } from 'react'
import { Box, Tabs, Tab, Button } from '@mui/material'
import axios from 'axios'
import {useRouter} from 'next/router';
import { Classes, useClasses } from '@/lib/classes';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import TabPanel, { a11yProps } from '@/components/Tabs';
import DashNav from '@/components/Dashboard/DashNav';
import MiniDrawer from '@/components/Dashboard/Drawer';
import LecturesHome from '@/components/ClassHome/Lectures';
import { isConstructorDeclaration } from 'typescript';
import Assignments from '@/components/ClassHome/Assignments';
import colors from '@/styles/colors';
import { montserrat } from '@/styles/fonts';
import { Email } from '@/lib/user';

export default function TeacherClassHome() {
    const client = useQueryClient()
    const router = useRouter();
    const [cls, scls] = useClasses()
    const { id } = router.query
    const [curClass, setCur] = useState<Classes | null>(null)
    console.log(id)
    const [tab, setTab] = useState(0)

    const handleTab = (e: React.SyntheticEvent, newVal: number) => { setTab(newVal) }

    const handleDelete = async () => {
        if(curClass===null) return
        const res = await axios.delete("/api/classes", {params: {class: curClass.Id}})
        router.push("/home")
    }

    const queryClient = useQueryClient()

    const handleUserRemove = useMutation({
        mutationFn: async (email: string) => await axios.delete("/api/classes/students", { params: { student: email, class: id } }),
        onSuccess: () => { queryClient.invalidateQueries(['teacherClasses', id]) }
    })

    useEffect(() => {
        if(cls.state==="hasData") {
            let t: boolean = false
            cls.data.map((c: Classes) => {
                console.log(c.Id)
                const cur: number = parseInt(id! as string)
                if(c.Id===cur) {
                    t = true
                    setCur(c)
                }
            })
            console.log(t)
            if(!t) router.push("/home")
        }
    }, [cls.state])

    const { status, data, error, isFetching } = useQuery({
        queryKey: ['teacherClasses', router.query.id],
        queryFn: async ({ queryKey }) => {
            const [_, cid] = queryKey
            console.log(cid)
            if(cid===undefined) return
            const res = await axios.get("/api/lectures", { params: { class: cid } })
            return res.data
        }
    })
    console.log("Lectures: ", curClass)

    // stuff for the drawer
    const [open, setOpen] = useState(false)
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)

    const mapStudents = () => {
        return curClass?.Students.length!==0 ? curClass?.Students.map(s => (
            <div className={`px-10 py-5 border-b-2 border-slate-200 w-full flex flex-row align-center`}>
                <div><a href={`mailto:${s}`} className={`flex-none font-sans ${montserrat.variable} font-light text-slate-600`}>{s}</a></div>
                <div className={`grow flex flex-row justify-end gap-6 font-sans ${montserrat.variable}`}>
                    <button className="bg-slate-200 text-slate-800 font-medium px-5 py-2 text-lg rounded-lg duration-300 hover:text-white border-white border-4 hover:-translate-y-1 hover:border-slate-200 hover:bg-slate-400">Email</button>
                    <button className="bg-red-500 text-white font-medium px-5 py-2 text-lg rounded-lg duration-300 hover:text-white border-white border-4 hover:-translate-y-1 hover:border-red-200 hover:bg-red-400" onClick={() => handleUserRemove.mutateAsync(s)}>Remove</button>
                </div>
            </div>
        )) : (<div className={`w-full flex justify-center align-center h-full ${montserrat.variable} font-sans`}><p className="text-2xl text-slate-300">No students</p></div>)
    }

    if(status!=="success") return <div>loading...</div>

    if (curClass!==null) return (
        <>
            <MiniDrawer open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose}>
                <div className="w-screen">
                    <div className="w-full pt-[2%] flex flex-row justify-center bg-slate-100">
                        <Tabs value={tab} onChange={handleTab} sx={{width: "50%", borderColor: colors.main, justifyContent: "center", display: "flex", flexDirection: "row", alignItems: "center"}} textColor="primary" indicatorColor="primary">
                            <Tab label="About" {...a11yProps(0)} sx={{width: "25%", height: "100%", borderColor: colors.main, borderWidth: 2}}/>
                            <Tab label="Lectures" {...a11yProps(1)} sx={{width: "25%"}}/>
                            <Tab label="Assignments" {...a11yProps(2)} sx={{width: "25%"}}/>
                            {/* <Tab label="Chat" {...a11yProps(3)} sx={{width: "25%"}}/> */}
                        </Tabs>
                    </div>
                    <TabPanel value={tab} index={0}>
                        <div className="flex flex-row pb-10 h-full">
                            <div className="w-[60%] bg-white p-10">
                                <p className={`font-sans ${montserrat.variable} text-7xl font-normal text-slate-700`}>Welcome to {curClass.Nm} {"\n"}</p>
                                <div className="h-10"/>
                                <p className={`font-sans ${montserrat.variable} text-2xl font-normal text-slate-500`}>Teacher: {curClass.Teacher}</p>
                                <div className="h-8"/>
                                <p className={`font-sans ${montserrat.variable} text-2xl font-normal text-slate-500`}>Id for invite: {curClass.Id}</p>
                                <div className="h-8"/>
                                <button className={`bg-green-500 px-5 py-3 text-xl text-white font-sans ${montserrat.variable} duration-300 hover:-translate-y-1 hover:bg-green-500 border-4 border-white hover:border-green-200 rounded-lg`} onClick={handleDelete}>Delete Class</button>
                            </div>
                            <div className="w-[40%] p-10">
                                <p className={`font-sans ${montserrat.variable} text-5xl font-light text-slate-700`}>Students</p>
                                <div className="h-8"/>
                                {mapStudents()}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <LecturesHome lectures={data} classID={curClass.Id}/>
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        <Assignments classID={curClass.Id}/>
                    </TabPanel>
                </div>
            </MiniDrawer>
        </>
    )
}

// export async function getStaticPaths() {
//     const user = await axios.get("/auth/current_user")
//     const res = await axios.get("/api/classes", { params: { user: user.data.email } })
//     console.log(res)
    
//     const paths = res.data.map((cls: any) => ({
//         params: { id: String(cls.Id) }
//     }))

//     console.log(paths)
//     // const npaths = [{params: {id: "1"}}, {params: {id: "2"}}, {params: {id: "3"}}]
//     return { paths: paths, fallback: true }
// }

// export async function getStaticProps({ params }: any) {
//     return { props: { cls: params.id     }}
// }