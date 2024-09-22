import React from 'react';
import { Avatar, ButtonBase, Hidden, makeStyles, IconButton, Typography } from '@material-ui/core';

// Icons
import { IconMenu2 } from '@tabler/icons';
import ExploreIcon from '@material-ui/icons/Explore';
import HomeIcon from '@material-ui/icons/Home';

import SearchIcon from '@material-ui/icons/Search';

import LogoSection from '../LogoSection';
import Customization from './Customization';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';
import HomeIconImg from '../../../assets/images/icons/home.png'
import SearchIconImg from '../../../assets/images/icons/magnifier.png'
import ExploreIconImg from '../../../assets/images/icons/compass.png'

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    headerAvtar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        transition: 'all .2s ease-in-out',
        background: theme.palette.primary.light,
        color: theme.palette.purple.dark,
        '&:hover': {
            background: theme.palette.purple.main,
            color: theme.palette.purple.light,
        },
    },
    boxContainer: {
        width: '228px',
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            width: 'auto',
        },
    },
    iconSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(2),
    },
    linkText: {
        marginLeft: theme.spacing(1),
        fontWeight: 500,
        color: theme.palette.text.primary,
        textDecoration: 'none',
    },
    iconButton: {
        marginRight:'10px',
        color: theme.palette.text.primary,
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
    iconImage: {
        width: 30,  // Reduced size of the icon
        height: 30, // Reduced size of the icon
    }
}));

const Header = (props) => {
    const { handleLeftDrawerToggle } = props;
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.boxContainer}>
                <Hidden mdDown>
                    <LogoSection />
                    <div className={classes.grow} />
                </Hidden>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar variant="rounded" className={classes.headerAvtar} onClick={handleLeftDrawerToggle}>
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </div>

            {/* Middle Section: Explore & Search */}
            <div className={classes.grow} />
            <div className={classes.iconSection}>
                {/* Home Link */}
                <IconButton
                    component="a"
                    href="/dashboard"
                    className={classes.iconButton}
                >
                    <img src={HomeIconImg} alt="Home" className={classes.iconImage} />
                </IconButton>

                {/* Explore Link */}
                <IconButton
                    component="a"
                    href="/explore"
                    className={classes.iconButton}
                >
                    <img src={ExploreIconImg} alt="Explore" className={classes.iconImage} />
                </IconButton>

                {/* Search Link */}
                <IconButton
                    component="a"
                    href="/search"
                    className={classes.iconButton}
                >
                    <img src={SearchIconImg} alt="Search" className={classes.iconImage} />
                </IconButton>
            </div>
            <div className={classes.grow} />
            <Hidden smDown>
                <Customization />
            </Hidden>

            {/* Profile Section */}
            <ProfileSection />
            <Hidden smUp>
                <MobileSection />
            </Hidden>
        </React.Fragment>
    );
};

export default Header;
