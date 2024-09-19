import React from 'react';
import { Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { useDispatch } from 'react-redux';
import { showMusicPlayer } from '../../../store/actions';
import { BACKEND_HOST } from '../../../api';

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
        height: '250px',
        cursor: 'pointer'
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
        padding: '10px',
        position: 'absolute',
        bottom: 0
    }
}));

const MusicItemCard = ({item}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleCardClick = () => {
        dispatch(showMusicPlayer(item)); // Pass the item to the player
    };

    return (
        <Card
            onClick={handleCardClick}
            style={{ backgroundImage: `url(${item.songItem.cover_img.startsWith('http') ? item.songItem.cover_img : `${BACKEND_HOST}${item.songItem.cover_img}`})` }}
            className={classes.card}
        >
            <CardContent className={classes.content}>
                <Grid container direction="column" style={{ flexGrow: 1 }}>
                    <Grid item>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <PlayCircleFilledIcon className="play-icon" />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.cardHeading}>
                            {item.songItem.visual_desc}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default MusicItemCard;
