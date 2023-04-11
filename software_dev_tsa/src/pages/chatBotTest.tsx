import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import user, { loginLocal } from '../lib/user'
import { useAtom } from 'jotai'
import colors from "../styles/colors"
import Head from 'next/head';

import { Grid, Box, TextField, Button, Typography, Divider, Avatar, Stack } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';


export default function test() {

  const router = useRouter();

  // form states
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")

  const loginFunction = () => {
    router.push('/auth/google')
  }

  const homeHandler = () => {
    router.push("/")
  }
  
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt:prompt }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setPrompt("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
    //   alert(error.message);
    }
  }

  return (
  <>
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;700&display=swap" rel="stylesheet"/>
    </Head>
    <Box sx={{height: "101vh"}}>
      <Grid container spacing={1} sx={{height: "100%"}}>
        <Grid item xs={5} sx={{display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "space-around", height: '50%', marginTop: '1.25%', backgroundColor: colors.white}}>
          <Stack direction="row" sx={{marginRight: "auto", marginLeft: "10%", alignItems: "center", padding: "5%", marginTop: "30%"}} onClick={homeHandler}>
            <Avatar sx={{backgroundColor: colors.main}}>L</Avatar>
            <Typography variant="h5" sx={{fontFamily: "'Titillium Web', sans-serif", marginLeft: "10px"}}>Classroom</Typography>
          </Stack>
            <Typography variant="h2" sx={{fontFamily: "'Titillium Web', sans-serif", marginBottom: "30px"}}>Login</Typography>
          <form onSubmit={(e)=> onSubmit(e)} style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
            <TextField type="text" id="em" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Prompt:" sx={{width: "200%"}}></TextField>
            <br/>
        
            <Button type="submit" variant="contained" sx={{width: "100%", height: "40px", backgroundColor: colors.main, marginTop: "30px", marginBottom: "20px"}}>Submit</Button>
          </form>
          <br/><br/>
          <Divider style={{width: "90%"}}/>
          <br/><br/>

        </Grid>
        <Grid item xs={7} sx={{backgroundColor: colors.dark}}>
          <Stack direction="row" spacing={2}>
            <Avatar variant="square" sx={{bgcolor: colors.main}}> </Avatar>
            <Avatar variant="square" sx={{bgcolor: colors.main}}> </Avatar>
            <Avatar variant="square" sx={{bgcolor: colors.main}}> </Avatar>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  </>
  );
}