import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'

// components
import Navbar from '@/components/Nav/navbar'
import { Box, Grid, Typography, Divider, Stack, TextField, Button } from '@mui/material'
import PersonIcon from "@mui/icons-material/Person"
import colors from '@/styles/colors'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const router = useRouter()

  const signUpRoute = () => {
    router.push("/signup")
  }

  return (
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
      <Box sx={{height: "150vh", overflow: "auto"}}>
        <Navbar/>
        <Grid container spacing={1} sx={{backgroundColor: colors.dark}}>
          <Grid item xs={6} sx={{display: "flex", width: "70%", justifyContent: "center", alignItems: "center", height: "72.5vh"}}>
            <Stack sx={{width: "70%"}} spacing={3}>
              <Typography variant="h3" sx={{fontSize: "50px", fontFamily: "'Titillium Web', sans-serif", fontWeight: "700", color: colors.main}}>WELCOME TO THIS THING</Typography>
              <Divider sx={{backgroundColor: colors.gray}}/>
              <Typography variant="body1" sx={{fontFamily: "'Titillium Web', sans-serif", color: colors.light, fontWeight: "300"}}>lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet</Typography>
              <Stack direction="row" spacing={2}>
                <form onSubmit={() => console.log("empty for now")} style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", width: "100%"}}>
                  <TextField id="outlined-basic" label="Email:" variant="outlined" sx={{backgroundColor: "white", borderRadius: "5px", width: "150%"}}/>
                  <Button variant="contained" sx={{backgroundColor: "#2b7a78", width: "50%", marginLeft: "5%"}} startIcon={<PersonIcon/>} onClick={signUpRoute}>
                    Sign Up
                  </Button>
                </form>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            EPIC GRAPHIC POG
          </Grid>
        </Grid>
        {/* <Stack direction="column" sx={{height: "20%"}}> */}
          <Box sx={{width: "100%", backgroundColor: colors.white, height: "30%"}}>About and Stuff</Box>
          <Box sx={{width: "100%", backgroundColor: colors.light, height: "50%"}}>Footer</Box>
        {/* </Stack> */}
      </Box>
    </>
  )
}
