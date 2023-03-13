import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from "react";

import user, { loginLocal } from '../data/user'
import { useAtom } from 'jotai'


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


  return (
  <div className={styles.main}>
    <h1>Login</h1>
    <form onSubmit={localLogin}>
      <label htmlFor="em">Email: </label>
      <input type="email" id="em" value={email} onChange={e => setEmail(e.target.value)}></input>
      <br/>
      <label htmlFor="pw">Password:</label>
      <input type="password" id="pw" value={password} onChange={e => setPassword(e.target.value)}/>
      <br/>
      <button type="submit">Submit</button>
    </form>
    <button type="button" onClick={() => loginFunction()} className={styles.button}>
      Login With Google
    </button>
  </div>
  );
}