import React, { useEffect, useState } from "react";
import colors from "@/styles/colors";

import { Box, TextField, Typography, Button } from "@mui/material";
import MiniDrawer from "@/components/Dashboard/Drawer";
import useUserAndClasses from "@/lib/hooks";
import { createClass } from "@/lib/classes";
import { useRouter } from "next/router";


export default function NewClass() {
    const [us, usStatus, cls, clsStatus] = useUserAndClasses()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)
    

    const newClassHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await createClass(name, us[0].email)
        router.push("/home")
    }

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