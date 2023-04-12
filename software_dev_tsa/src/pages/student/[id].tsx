import React, { useState, useEffect } from 'react'
import { Box, Tabs, Tab, Button } from '@mui/material'
import axios from 'axios'
import {useRouter} from 'next/router';
import { Classes, useClasses } from '@/lib/classes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TabPanel, { a11yProps } from '@/components/Tabs';
import DashNav from '@/components/Dashboard/DashNav';
import MiniDrawer from '@/components/Dashboard/Drawer';
import StudentLecturesHome from '@/components/ClassHome/StudentLectures';
import { Lecture } from '@/lib/classData';

export default function TeacherClassHome() {
    const client = useQueryClient()
    const router = useRouter();
    const [cls, scls] = useClasses()
    const { id } = router.query
    const [curClass, setCur] = useState<Classes>()

    const [tab, setTab] = useState(0)

    const handleTab = (e: React.SyntheticEvent, newVal: number) => {
        setTab(newVal)
    }

    useEffect(() => {
        if(scls.state==="hasData") {
            console.log("scls: ", scls)
            let t: boolean = false
            scls.data.map((c: Classes) => {
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
    }, [scls.state])

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

    // stuff for the drawer
    const [open, setOpen] = useState(false)
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)

    if(status!=="success") return <div>loading...</div>

    return (
        <>
            <DashNav open={open} handleDrawerOpen={handleDrawerOpen}/>
            <MiniDrawer open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose}>
                <div>
                    <Tabs value={tab} onChange={handleTab}>
                        <Tab label="About" {...a11yProps(0)}/>
                        <Tab label="Lectures" {...a11yProps(1)}/>
                        <Tab label="Assignments" {...a11yProps(2)}/>
                        <Tab label="Tests" {...a11yProps(3)}/>
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        Welcome to {curClass?.Nm}
                        teacher: {curClass?.Teacher}
                        <Button variant="contained">Leave Class</Button>
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <StudentLecturesHome lectures={data} classID={curClass?.Id!}/>
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