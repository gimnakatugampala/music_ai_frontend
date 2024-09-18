import React from 'react';
import { Avatar, Box, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { useDispatch } from 'react-redux';
import { showMusicPlayer } from '../../../store/actions';
import './styles.css'; // Make sure your styles are imported correctly

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

const MusicItemCard = ({ item }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleCardClick = () => {
        dispatch(showMusicPlayer(item)); // Pass the item to the player
    };

    return (
        <Card
            onClick={handleCardClick}
            style={{ backgroundImage: `url(${item.cover_img})` }} // Use cover_img from the API response
            className={[classes.card, 'card-item']}
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
                        <Typography className={[classes.cardHeading, 'card-item-text']}>
                            {item.visual_desc} {/* Display the visual description */}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default MusicItemCard;
