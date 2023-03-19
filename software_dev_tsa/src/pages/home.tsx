import react from "react"
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { useUserBlock } from "@/data/user";

export default function Home() {
    const loading = useUserBlock()
    return loading === "pending" ? <div>LOADING</div> : <div>HOME</div> 
}
