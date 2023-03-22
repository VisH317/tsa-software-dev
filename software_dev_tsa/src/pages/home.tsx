import react from "react"
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { useUser } from "@/data/user";
import Head from "next/head";
import { Box, Grid, Tooltip } from "@mui/material"
import colors from "@/styles/colors";
import MiniDrawer from "@/components/Dashboard/Drawer";
import { useRouter } from "next/router";

// styles & icons
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material'


export default function Home() {
    const [user, loading] = useUser(true)
    const router = useRouter()
    const handleNewClass = () => router.push("/newClass")

    return loading === "pending" ? <div>LOADING</div> : (
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
            <Box sx={{height: "100vh", overflow: "auto"}}>
                {/* <Grid container spacing={0} sx={{}}>
                    <Grid item xs={4}>
                        Sidebar Nav
                    </Grid>
                    <Grid item sx={8}>
                        Main Content
                    </Grid>
                </Grid> */}
                <MiniDrawer/>
            </Box>
            <Tooltip placement="left" title="New Class" arrow>
                <IconButton sx={{backgroundColor: colors.main, color: colors.white, position: "fixed", bottom: "5%", right: "4%", boxShadow: "2px 2px 6px #777", "&:hover": {boxShadow: "0", backgroundColor: colors.light}}} onClick={handleNewClass}>
                    <AddIcon fontSize="large" sx={{fontSize: "60px",}}/>
                </IconButton>
            </Tooltip>
        </>
    )
}
