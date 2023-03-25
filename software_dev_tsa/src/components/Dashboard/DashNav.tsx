import React from 'react'
import { Toolbar, IconButton, Typography } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material';
import colors from '@/styles/colors';
import MenuIcon from '@mui/icons-material/Menu';


const drawerWidth = 240

interface AppBarProps extends MuiAppBarProps {
open?: boolean;
}

const AppBar = styled(MuiAppBar, {
shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
zIndex: theme.zIndex.drawer + 1,
transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
}),
...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
    }),
}),
}));

interface DashNavProps {
    open: boolean,
    handleDrawerOpen: () => void
}

export default function DashNav(props: DashNavProps) {

    const { open, handleDrawerOpen } = props

    return (
        <AppBar position="fixed" open={open} sx={{backgroundColor: colors.dark}}>
            <Toolbar>
            <IconButton
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
                color: colors.light
                }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
                {/* Mini variant drawer */}
            </Typography>
            </Toolbar>
        </AppBar>
    )
}