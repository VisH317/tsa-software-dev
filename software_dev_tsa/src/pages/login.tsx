import react from "react"
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from "react";


export default function Login() {
  const router = useRouter();

  const [login, setLogin] = useState(true)

  const loginFunction = ()=>{
    router.push('/home')
  }

  return (
  <div className={styles.main}>
    <h1>Login</h1>
    <button type="button" onClick={() => loginFunction()}>
      Login
    </button>
  </div>
  );
}