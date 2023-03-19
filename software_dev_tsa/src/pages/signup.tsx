import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import colors from '@/styles/colors'
import { Box, Grid, Avatar, Typography, Stack, TextField, Button } from '@mui/material'
import Head from 'next/head'
import { signUp } from '@/data/user'

export default function Signup() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter()

    const homeHandler = () => {
        router.push("/")
    }

    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await signUp(username, email, password)
        router.push("/")
    }

    return (
        <>
            <Head>
            <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;700&display=swap" rel="stylesheet"/>
            </Head>
            <Box sx={{height: "101vh"}}>
            <Grid container spacing={1} sx={{height: "100%", backgroundColor: colors.white}}>
                <Grid item xs={6} sx={{display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "space-around", height: '100%', marginTop: '1.25%'}}>
                    <Stack direction="row" sx={{marginRight: "auto", marginLeft: "30px", display: "flex", alignItems: "center", height: "10%"}} onClick={homeHandler}>
                        <Avatar sx={{backgroundColor: colors.main}}>L</Avatar>
                        <Typography variant="h5" sx={{fontFamily: "'Titillium Web', sans-serif", marginLeft: "10px", color: colors.dark}}>Classroom</Typography>
                    </Stack>
                    <Typography variant="h2" sx={{fontFamily: "'Titillium Web', sans-serif", color: colors.main, height: "10%"}}>Sign Up</Typography>
                    <form onSubmit={submitHandler} style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", height: "30%"}}>
                        <TextField type="text" id="us" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username: " sx={{width: "300%"}}/>
                        <br/>
                        <TextField type="email" id="em" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email:" sx={{width: "300%"}}/>
                        <br/>
                        <TextField type="password" id="pw" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password:" sx={{width: "300%"}}/>
                        <br/>
                        <Button type="submit" variant="contained" sx={{width: "100%", height: "40px", backgroundColor: colors.main, marginTop: "10px"}}>Submit</Button>
                    </form>
                    <Box sx={{height: "25%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Stack direction="row" spacing={2}>
                            <Avatar sx={{bgcolor: colors.main, height: 24, width: 24}}> </Avatar>
                            <Avatar sx={{bgcolor: colors.main, height: 24, width: 24}}> </Avatar>
                            <Avatar sx={{bgcolor: colors.main, height: 24, width: 24}}> </Avatar>
                        </Stack>
                    </Box>
                    <Box sx={{width: "100%", backgroundColor: colors.light, flexGrow : "1", height: "10%", padding: "5% 5% 5% 5%"}}>
                        <Typography variant="h3" sx={{fontFamily: "'Titillium Web', sans-serif", marginLeft: "5%", fontWeight: "700", marginRight: "5%"}}>Terms of Service:</Typography>
                        <br/>
                        <Typography variant="body1" sx={{fontFamily: "'Titillium Web', sans-serif", marginLeft: "5%", fontWeight: "300", width: "90%"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} sx={{backgroundColor: colors.dark}}>
                <Stack direction="row" spacing={2}>
                    <Avatar variant="square" sx={{bgcolor: colors.main}}> </Avatar>
                    <Avatar variant="square" sx={{bgcolor: colors.main}}> </Avatar>
                    <Avatar variant="square" sx={{bgcolor: colors.main}}> </Avatar>
                </Stack>
                </Grid>
            </Grid>
            </Box>
        </>
    )
}