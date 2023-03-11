import react from "react"
import styles from '@/styles/Home.module.css'
import Link from 'next/link';

export default function Login() {
  return (
  <div className={styles.main}>
    <h1>First Post</h1>
    <Link href="/login">this page!</Link>
  </div>
  );
}