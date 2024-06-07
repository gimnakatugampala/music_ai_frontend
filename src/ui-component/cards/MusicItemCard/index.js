import React from 'react';
import {Avatar, Box, Card, CardContent, Grid, makeStyles, Menu, MenuItem, Typography} from '@material-ui/core';

import EarningIcon from './../../../assets/images/icons/earning.svg';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import GetAppTwoToneIcon from '@material-ui/icons/GetAppOutlined';
import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@material-ui/icons/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@material-ui/icons/ArchiveOutlined';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import './styles.css'

const useStyles = makeStyles((theme) => ({
    card: {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', 
        backgroundColor: theme.palette.purple.main,
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        backgroundBlendMode: 'darken',
        height:'250px'
    },
    content: {
        padding: '20px !important',
        position: 'relative',
        height: '100%',
        zIndex: 1, 
    },
    cardHeading: {
        fontSize: '1.125rem',
        fontWeight: 500,
        padding:'10px',
        position:'absolute',
        bottom:0
    }
}));

const MusicItemCard = ({item}) => {
    const classes = useStyles();



    return (
        <Card style={{ backgroundImage: `url(${item.img})` }} className={[classes.card,'card-item']}>
        <CardContent className={classes.content}>
            <Grid container direction="column" style={{ flexGrow: 1 }}>
                <Grid item>
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <PlayCircleFilledIcon className='play-icon' />
                        </Grid>
                    </Grid>
                </Grid>
                
                <Grid item>
                    <Typography className={[classes.cardHeading,'card-item-text']}>
                        used to demonstrate the visual form of a document or a typeface without relying on meaningful content.
                    </Typography>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
    );
};

export default MusicItemCard;
