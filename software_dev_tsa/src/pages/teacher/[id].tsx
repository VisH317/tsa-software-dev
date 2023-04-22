import React, { useState, useEffect } from 'react'
import { Box, Tabs, Tab, Button } from '@mui/material'
import axios from 'axios'
import {useRouter} from 'next/router';
import { Classes, useClasses } from '@/lib/classes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TabPanel, { a11yProps } from '@/components/Tabs';
import DashNav from '@/components/Dashboard/DashNav';
import MiniDrawer from '@/components/Dashboard/Drawer';
import LecturesHome from '@/components/ClassHome/Lectures';
import { isConstructorDeclaration } from 'typescript';
import Assignments from '@/components/ClassHome/Assignments';

export default function TeacherClassHome() {
    const client = useQueryClient()
    const router = useRouter();
    const [cls, scls] = useClasses()
    const { id } = router.query
    const [curClass, setCur] = useState<Classes | null>(null)
    console.log(id)
    const [tab, setTab] = useState(0)

    const handleTab = (e: React.SyntheticEvent, newVal: number) => {
        setTab(newVal)
    }

    const handleDelete = async () => {
        if(curClass===null) return
        const res = await axios.delete("/api/classes", {params: {class: curClass.Id}})
        router.push("/home")
    }

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

    if(status!=="success") return <div>loading...</div>

    if (curClass!==null) return (
        <>
            <DashNav open={open} handleDrawerOpen={handleDrawerOpen}/>
            <MiniDrawer open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose}>
                <div>
                    <Tabs value={tab} onChange={handleTab}>
                        <Tab label="About" {...a11yProps(0)}/>
                        <Tab label="Lectures" {...a11yProps(1)}/>
                        <Tab label="Assignments" {...a11yProps(2)}/>
                        <Tab label="Chat" {...a11yProps(3)}/>
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        Welcome to {curClass.Nm} {"\n"}
                        teacher: {curClass.Teacher}
                        <Button variant="contained" onClick={handleDelete}>Delete Class</Button>
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