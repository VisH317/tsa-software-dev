import React from 'react'
import { Box } from '@mui/material'
import axios from 'axios'
import { isConstructorDeclaration } from 'typescript'

export default function Cls({ cls }: any) {
    console.log(cls)
    return (
        <div>
            {cls}
        </div>
    )
}

export async function getStaticPaths() {
    // const user = await axios.get("/auth/current_user")
    // const res = await axios.get("/api/classes", { params: { user: user.data.email } })
    // console.log(res)
    
    // const paths = res.data.map((cls: any) => ({
    //     params: { id: cls.Id }
    // }))

    // console.log(paths)
    const paths = [{params: {id: 1}}, {params: {id: 2}}, {params: {id: 3}}]
    return { paths, fallback: true }
}

export async function getStaticProps({ params }: any) {
    return { props: { cls: params.id }}
}