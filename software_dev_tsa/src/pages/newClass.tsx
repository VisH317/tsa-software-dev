import React, { useEffect, useState } from "react";
import colors from "@/styles/colors";

import { Box, TextField, Typography, Button, Tabs, Tab } from "@mui/material";
import MiniDrawer from "@/components/Dashboard/Drawer";
import { createClass, joinClass } from "@/lib/classes";
import { useRouter } from "next/router";

// data hooks
import { useUser } from "@/lib/user";
import { useClasses } from "@/lib/classes";


export default function NewClass() {
    const us = useUser()
    const [cls, scls] = useClasses()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)

    // check if create or join class
    const [tab, setTab] = useState(0)

    const handleTab = (e: React.SyntheticEvent, newVal: number) => {
        setTab(newVal)
    }
    

    const newClassHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(us.state!=="hasData") return
        await createClass(name, us.data.email)
        router.push("/home")
    }

    const joinClassHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(us.state!=="hasData") return
        await joinClass(parseInt(id), us.data.email)
        router.push("/home")
    }

    const [name, setName] = useState("")
    const [id, setId] = useState("")

    if(us.state==="loading" || cls.state==="loading") return <div>LOADING</div>

    return (
        <MiniDrawer open={open} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen}>
            <Box sx={{width: "50%", padding: "30px", backgroundColor: colors.white}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={handleTab} aria-label="basic tabs example">
                        <Tab label="Item One" {...a11yProps(0)} />
                        <Tab label="Item Two" {...a11yProps(1)} />
                        <Tab label="Item Three" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={tab} index={0}>
                    <form onSubmit={newClassHandler}>
                        <Typography variant="h3">Create Class</Typography>
                        <TextField type="text" placeholder="Name:" value={name} onChange={e => setName(e.target.value)}/>
                        <Button type="submit" variant="contained" sx={{backgroundColor: colors.main}}>Create Class</Button>
                    </form>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <form onSubmit={joinClassHandler}>
                    <Typography variant="h3">Join Class</Typography>
                    <TextField type="text" placeholder="Class ID:" value={id} onChange={e => setId(e.target.value)}/>
                    <Button type="submit" variant="contained" sx={{backgroundColor: colors.main}}>Join Class</Button>
                    </form>
                </TabPanel>
            </Box>
        </MiniDrawer>
    )
}

function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}