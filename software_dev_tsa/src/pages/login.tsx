import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from "react";


import user, { loginLocal } from '../data/user'
import { useAtom } from 'jotai'
import colors from "../styles/colors"

import Head from 'next/head';

import { Grid, Box, TextField, Button, Typography, Divider, Avatar, Stack } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';


export default function Login() {

  const [u, setu] = useAtom(user)
  const router = useRouter();

  // form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const loginFunction = () => {
    router.push('/auth/google')
  }

  const localLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    await loginLocal(email, password)
  }

  const homeHandler = () => {
    router.push("/")
  }

  return (
  <>
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;700&display=swap" rel="stylesheet"/>
    </Head>
    <Box sx={{height: "101vh"}}>
      <Grid container spacing={1} sx={{height: "100%"}}>
        <Grid item xs={3} sx={{display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "space-around", height: '50%', marginTop: '1.25%', backgroundColor: colors.white}}>
          <Stack direction="row" sx={{marginRight: "auto", marginLeft: "10%", alignItems: "center"}} onClick={homeHandler}>
            <Avatar sx={{backgroundColor: colors.main}}>L</Avatar>
            <Typography variant="h5" sx={{fontFamily: "'Titillium Web', sans-serif", marginLeft: "10px"}}>Classroom</Typography>
          </Stack>
            <Typography variant="h2" sx={{fontFamily: "'Titillium Web', sans-serif"}}>Login</Typography>
          <form onSubmit={localLogin} style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
            <TextField type="email" id="em" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email:" sx={{width: "200%"}}></TextField>
            <br/>
            <TextField type="password" id="pw" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password:" sx={{width: "200%"}}/>
            <br/>
            <Button type="submit" variant="contained" sx={{width: "100%", height: "40px", backgroundColor: colors.main}}>Submit</Button>
          </form>
          <Divider style={{width: "90%"}}/>
          <Button type="button" startIcon={<GoogleIcon/>} onClick={() => loginFunction()} variant="contained" sx={{backgroundColor: "#b7bdbb", color: "#111", fontSize: "20px", fontWeight: "700", fontFamily: "'Titillium Web', sans-serif", height: "10%", with: "50%", borderRadius: "12.5px", boxShadow: "1px 1px 4px #aaa"}}>
            Login With Google
          </Button>
        </Grid>
        <Grid item xs={9} sx={{backgroundColor: colors.dark}}>
          BRUH
        </Grid>
      </Grid>
    </Box>
  </>
  );
}