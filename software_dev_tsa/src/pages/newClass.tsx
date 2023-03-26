import React, { useEffect, useState } from "react";
import user from "@/data/user";
import useClasses, { createClass } from "@/data/classes";
import colors from "@/styles/colors";

import { Box, TextField, Typography, Button } from "@mui/material";
import DashNav from "@/components/Dashboard/DashNav";
import MiniDrawer from "@/components/Dashboard/Drawer";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import useUserAndClasses from "@/data/hooks";


export default function NewClass() {
    const [us, usStatus, cls, clsStatus] = useUserAndClasses()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)
    

    const newClassHandler = () => console.log('bruh')

    const [name, setName] = useState("")

    if(usStatus[0]!=="loading" || clsStatus[0]!=="loading") return <div>LOADING</div>

    return (
        <MiniDrawer open={open} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen}>
            <Box sx={{width: "50%", padding: "30px", backgroundColor: colors.white}}>
                <form onSubmit={newClassHandler}>
                    <Typography variant="h1"></Typography>
                    <TextField type="text" placeholder="Name:" value={name} onChange={e => setName(e.target.value)}></TextField>
                    <Button type="submit" variant="contained" sx={{backgroundColor: colors.main}}>Create Class</Button>
                </form>
            </Box>
        </MiniDrawer>
    )
}