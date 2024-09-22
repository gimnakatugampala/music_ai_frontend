import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Avatar,
    Card,
    CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    Fade,
    Grid,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    OutlinedInput,
    Paper,
    Popper,
    Switch,
    Typography,
    useTheme
} from '@material-ui/core';

import {IconLogout, IconSearch, IconSettings} from '@tabler/icons';

import UpgradePlanCard from '../../../../ui-component/cards/UpgradePlanCard';

import User1 from './../../../../assets/images/music_ai_profile_img.png';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { useDispatch } from 'react-redux';
import ErrorToast from '../../../../ui-component/toast/ErrorToast';
import Cookies from 'js-cookie';
import { CURRENT_USER } from '../../../../api';

const useStyles = makeStyles((theme) => ({
    navContainer: {
        width: '100%',
        maxWidth: '350px',
        minWidth: '300px',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            minWidth: '100%'
        }
    },
    headerAvtar: {
        cursor: 'pointer',
        ...theme.typography.mediumAvatar,
        margin: '8px 0 8px 8px !important'
    },
    profileChip: {
        height: '48px',
        alignItems: 'center',
        borderRadius: '27px',
        transition: 'all .2s ease-in-out',
        borderColor: theme.palette.primary.light,
        backgroundColor: theme.palette.primary.light,
        '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: theme.palette.primary.main + '!important',
            color: theme.palette.primary.light,
            '& svg': {
                stroke: theme.palette.primary.light
            }
        }
    },
    profileLabel: {
        lineHeight: 0,
        padding: '12px'
    },
    listItem: {
        marginTop: '5px'
    },
    cardContent: {
        padding: '16px !important'
    },
    card: {
        backgroundColor: theme.palette.primary.light,
        marginBottom: '16px',
        marginTop: '16px'
    },
    searchControl: {
        width: '100%',
        paddingRight: '8px',
        paddingLeft: '16px',
        marginBottom: '16px',
        marginTop: '16px'
    },
    startAdornment: {
        fontSize: '1rem',
        color: theme.palette.grey[500]
    },
    flex: {
        display: 'flex'
    },
    name: {
        marginLeft: '2px',
        fontWeight: 400
    },
    ScrollHeight: {
        height: '100%',
        maxHeight: 'calc(100vh - 250px)',
        overflowX: 'hidden'
    },
    badgeyellow: {
        backgroundColor: theme.palette.warning.dark,
        color: '#fff'
    }
}));

const ProfileSection = () => {
    const classes = useStyles();
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const [sdm, setSdm] = React.useState(true);
    const [value, setValue] = React.useState('');
    const [notification, setNotification] = React.useState(false);
    const [selectedIndex] = React.useState(1);
    const [profileImgSrc, setProfileImgSrc] = useState(User1); // Initial state set to default image


    const user = useSelector((state) => state.user.user);

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const handleLogout = async () => {
        try {
            //handleClose();
            //await logout();

            Cookies.remove('music_ai_user')

            ErrorToast("User logged logout")

            setTimeout(() => {
                window.location.href = "/login"
            }, 1500);


        } catch (err) {
            console.error(err);
        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    // const profileImgSrc = user == null ? User1 :  user.profile_img;
  // Effect to load profile image from cookies or fallback to default

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Usage example
const loadProfileImage = debounce((url) => {
    setProfileImgSrc(url);
}, 300);


useEffect(() => {
    try {
        const userCookie = Cookies.get('music_ai_user');
        if (userCookie) {
            const user = JSON.parse(userCookie);
            if (user && user.profile_img) {
                const imgUrl = user.profile_img
                loadProfileImage(imgUrl); // Call debounced image loader
            }
        }
    } catch (error) {
        console.error('Error parsing user cookie:', error);
    }
}, []);

useEffect(() => {
    try {
        const userCookie = Cookies.get('music_ai_user'); 
        if (userCookie) {
            const user = JSON.parse(userCookie);
            if (user && user.profile_img) {
                const imgUrl = user.profile_img.startsWith('http') ? user.profile_img : `https://${user.profile_img}`;
                setProfileImgSrc(imgUrl); // Set the profile image
            }
        }
    } catch (error) {
        console.error('Error parsing user cookie:', error);
    }
}, []);

    return (
        user != null && 
        <React.Fragment>
            <Chip
                classes={{label: classes.profileLabel}}
                className={classes.profileChip}
                icon={
                    <Avatar
                        src={profileImgSrc}
                        className={classes.headerAvtar}
                        onError={() => setProfileImgSrc(User1)} // Fallback to default image on error
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                        referrerPolicy="no-referrer" 
                        crossOrigin="anonymous" 
                    />
                }
                label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({TransitionProps, placement}) => (
                    <Fade {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Card elevation={16}>
                                    <CardContent className={classes.cardContent}>
                                        <Grid container direction="column" spacing={0}>
                                            <Grid item className={classes.flex}>
                                                <Typography component="span" variant="h4" className={classes.name}>
                                                    {user.first_name == null ? "" : user.first_name} {user.last_name == null ? "" : user.last_name}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2">{user.email == null ? "" : user.email}</Typography>
                                            </Grid>
                                        </Grid>
                                       
                                      
                                        <PerfectScrollbar className={classes.ScrollHeight}>
                                        

                                            <List component="nav" className={classes.navContainer}>
                                                {/* <ListItem
                                                    className={classes.listItem}
                                                    sx={{borderRadius: customization.borderRadius + 'px'}}
                                                    button
                                                    // selected={selectedIndex == 1}
                                                    onClick={(e) => window.location.href = "/login"}
                                                >
                                                    <ListItemIcon>
                                                        <LockOpenIcon stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Login</Typography>} />
                                                </ListItem> */}

                                                {/* <ListItem
                                                    className={classes.listItem}
                                                    sx={{borderRadius: customization.borderRadius + 'px'}}
                                                    button
                                                    // selected={selectedIndex == 2}
                                                    onClick={(e) => window.location.href = "/register"}
                                                >
                                                    <ListItemIcon>
                                                        <PersonOutlineIcon stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Register</Typography>} />
                                                </ListItem> */}

                                                <ListItem
                                                    className={classes.listItem}
                                                    sx={{borderRadius: customization.borderRadius + 'px'}}
                                                    button
                                                    // selected={selectedIndex == 3}
                                                    onClick={handleLogout}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                                </ListItem>
                                            </List>
                                        </PerfectScrollbar>
                                    </CardContent>
                                </Card>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </React.Fragment>
    );
};

export default ProfileSection;
