import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Head from 'next/head';
import { Classes } from '@/lib/classes';

import colors from '@/styles/colors';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import ClassesList from './ClassesList';
import DashNav from './DashNav';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: colors.dark,
  color: colors.light
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: colors.dark,
  color: colors.light
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    backgroundColor: colors.dark,
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

interface DrawerProps {
  open: boolean,
  handleDrawerOpen: () => void,
  handleDrawerClose: () => void,
  children: React.ReactNode
}

export default function MiniDrawer(props: DrawerProps) {
  const theme = useTheme();

  const { open, handleDrawerOpen, handleDrawerClose, children } = props

  return (
    <>
        <Head>
            <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;700&display=swap" rel="stylesheet"/>
        </Head>
        <CssBaseline />
        <Box sx={{display: "flex"}}>
        <DashNav open={open} handleDrawerOpen={handleDrawerOpen}/>
        <Drawer variant="permanent" open={open} sx={{backgroundColor: colors.light}}>
            <DrawerHeader>
            <IconButton onClick={handleDrawerClose} sx={{color: colors.light}}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
            {['Classes', 'To Do', 'Account'].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                    sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    transition: "0.25s",
                    "&:hover": {backgroundColor: colors.main, opacity: "1", color: colors.main}
                    }}
                >
                    <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: colors.white,

                    }}
                    >
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant={"body2"} sx={{fontFamily: "'Titillium Web', sans-serif", fontSize: "20px"}}>{text}</Typography>} sx={{ opacity: open ? 1 : 0, fontFamily: "'Titillium Web', sans-serif" }} />
                </ListItemButton>
                </ListItem>
            ))}
            </List>
            <Divider />
            <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                    sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    transition: "0.25s",
                    "&:hover": {backgroundColor: colors.main, opacity: "1", color: colors.main}
                    }}
                >
                    <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: colors.light
                    }}
                    >
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant={"body2"} sx={{fontFamily: "'Titillium Web', sans-serif", fontSize: "20px"}}>{text}</Typography>} sx={{ opacity: open ? 1 : 0, fontFamily: "'Titillium Web', sans-serif" }} />
                </ListItemButton>
                </ListItem>
            ))}
            </List>
        </Drawer>
        <Box component="main" sx={{flexGrow: 1, p: 3, marginTop: "100px"}}>
          {children}
        </Box>
        </Box>
    </>
  );
}