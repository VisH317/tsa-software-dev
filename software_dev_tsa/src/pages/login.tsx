import styles from "@/styles/Home.module.css";
import "../styles/Login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import user, { loginLocal } from "../lib/user";
import { useAtom } from "jotai";
import colors from "../styles/colors";

import Head from "next/head";

import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Avatar,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { ThemeProvider } from "@mui/material/styles";

import { theme } from "../lib/buttonThemeOverride";

export default function Login() {
  const router = useRouter();

  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Showing password input stuff
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // Sign in with Google
  const loginFunction = () => {
    router.push("/auth/google");
  };

  // Sign in with email & password
  const localLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    await loginLocal(email, password);
    router.push("/home");
  };

  // Clicking logo redirects you back home
  const homeHandler = () => {
    router.push("/");
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Box>
        <Grid container sx={{ height: "100vh" }}>
          <Grid
            item
            xs={5}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "space-around",
              height: "50%",
              marginTop: "1.25%",
              backgroundColor: colors.white,
            }}
          >
            <Stack
              direction="row"
              sx={{
                marginRight: "auto",
                marginLeft: "10%",
                alignItems: "center",
                padding: "5%",
                marginTop: "30%",
              }}
              onClick={homeHandler}
            >
              
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Titillium Web', sans-serif",
                  marginLeft: "10px",
                }}
              >
                
              </Typography>
            </Stack>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Titillium Web', sans-serif",
                marginBottom: "2rem",
              }}
            >
              Login
            </Typography>
            <form
              onSubmit={localLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {/* <TextField type="email" id="em" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email:" sx={{width: "150%"}}></TextField> */}
              <TextField
                id="em"
                label="Email"
                type="email"
                variant="outlined"
                sx={{ width: "150%" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* <TextField type="password" id="pw" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password:" sx={{width: "200%"}}/> */}
              <FormControl
                sx={{ m: 1, width: "150%", marginTop: "0.5rem" }}
                variant="outlined"
              >
                <InputLabel htmlFor="pw">Password</InputLabel>
                <OutlinedInput
                  id="pw"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <br />
              <ThemeProvider theme={theme}>
                <Button
                  type="submit"
                  variant="contained"
                  color="teal"
                  sx={{
                    width: "100%",
                    height: "40px",
                    marginTop: "30px",
                    marginBottom: "20px",
                    backgroundColor: "black"
                  }}
                >
                  Submit
                </Button>
              </ThemeProvider>
            </form>
            <br />
            <br />
            <Divider style={{ width: "70%" }} />
            <br />
            <br />
            <ThemeProvider theme={theme}>
              <Button
                className="login"
                type="button"
                startIcon={
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0,0,256,256"
                  >
                    <g
                      fill="none"
                      fill-rule="nonzero"
                      stroke="none"
                      stroke-width="1"
                      stroke-linecap="butt"
                      stroke-linejoin="miter"
                      stroke-miterlimit="10"
                      stroke-dasharray=""
                      stroke-dashoffset="0"
                      font-family="none"
                      font-weight="none"
                      font-size="none"
                      text-anchor="none"
                    >
                      <g transform="scale(5.33333,5.33333)">
                        <path
                          d="M43.611,20.083h-1.611v-0.083h-18v8h11.303c-1.649,4.657 -6.08,8 -11.303,8c-6.627,0 -12,-5.373 -12,-12c0,-6.627 5.373,-12 12,-12c3.059,0 5.842,1.154 7.961,3.039l5.657,-5.657c-3.572,-3.329 -8.35,-5.382 -13.618,-5.382c-11.045,0 -20,8.955 -20,20c0,11.045 8.955,20 20,20c11.045,0 20,-8.955 20,-20c0,-1.341 -0.138,-2.65 -0.389,-3.917z"
                          fill="#ffc107"
                        ></path>
                        <path
                          d="M6.306,14.691l6.571,4.819c1.778,-4.402 6.084,-7.51 11.123,-7.51c3.059,0 5.842,1.154 7.961,3.039l5.657,-5.657c-3.572,-3.329 -8.35,-5.382 -13.618,-5.382c-7.682,0 -14.344,4.337 -17.694,10.691z"
                          fill="#ff3d00"
                        ></path>
                        <path
                          d="M24,44c5.166,0 9.86,-1.977 13.409,-5.192l-6.19,-5.238c-2.008,1.521 -4.504,2.43 -7.219,2.43c-5.202,0 -9.619,-3.317 -11.283,-7.946l-6.522,5.025c3.31,6.477 10.032,10.921 17.805,10.921z"
                          fill="#4caf50"
                        ></path>
                        <path
                          d="M43.611,20.083h-1.611v-0.083h-18v8h11.303c-0.792,2.237 -2.231,4.166 -4.087,5.571c0.001,-0.001 0.002,-0.001 0.003,-0.002l6.19,5.238c-0.438,0.398 6.591,-4.807 6.591,-14.807c0,-1.341 -0.138,-2.65 -0.389,-3.917z"
                          fill="#1976d2"
                        ></path>
                      </g>
                    </g>
                  </svg>
                }
                onClick={() => loginFunction()}
                variant="contained"
                color="white"
                sx={{
                  marginTop: "1rem",
                  color: "#111",
                  fontSize: "20px",
                  fontWeight: "700",
                  fontFamily: "'Titillium Web', sans-serif",
                  padding: "0.5rem 2rem",
                  borderRadius: "12.5px",
                  marginBottom: "1rem",
                }}
              >
                Sign in with Google
              </Button>
            </ThemeProvider>
            <h5>Don't have an account? <a href="/signup">Sign up here</a></h5>
          </Grid>
          <Grid item xs={7} sx={{ backgroundColor: "#1f2937" }}>
            <Stack direction="row" spacing={2}>
              <img 
              style={{margin:150, justifyContent:"center",width:"70%", height:"70%"}}
              src="/undraw_education_f8ru (1).svg"
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
