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
        color: theme.palette.text.primary,
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
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
                    <HomeIcon />
                    <Typography variant="body1" className={classes.linkText}>
                        Home
                    </Typography>
                </IconButton>

                {/* Explore Link */}
                <IconButton
                    component="a"
                    href="/explore"
                    className={classes.iconButton}
                >
                    <ExploreIcon />
                    <Typography variant="body1" className={classes.linkText}>
                        Explore
                    </Typography>
                </IconButton>

                {/* Search Link */}
                <IconButton
                    component="a"
                    href="/search"
                    className={classes.iconButton}
                >
                    <SearchIcon />
                    <Typography variant="body1" className={classes.linkText}>
                        Search
                    </Typography>
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
