import React, { useState } from 'react'
import { Box } from '@mui/material'
import { StringLiteral } from 'typescript'

interface ModalProps {
    children: React.ReactNode,
    open: boolean,
    close: () => void,
    height: string
}

export default function Modal(props: ModalProps) {
    return (
        <Box sx={{width: "100%", height: "100vh", position: "fixed", zIndex: 50, backgroundColor: "rgba(10, 10, 10, 0.5)", top: "0px", left: "0px", display: props.open ? "flex" : "none", justifyContent: "center", alignItems: "center"}} onClick={props.close}>
            <Box sx={{width: "50vh", height: props.height, backgroundColor: "white", borderRadius: "20px", padding: "5px", position: "fixed", overflow: "hidden"}} onClick={e => e.stopPropagation()}>
                {props.children}
            </Box>
        </Box>
    )
}
