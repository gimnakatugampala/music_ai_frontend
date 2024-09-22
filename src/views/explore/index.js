import React, { useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, IconButton, CircularProgress } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { BACKEND_HOST } from '../../api'; // Adjust this path if necessary
import { useDispatch, useSelector } from 'react-redux';
import { showMusicPlayer } from '../../store/actions'; // Adjust import paths
import { fetchExploreMusicData } from '../../store/exploreMusicActions';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  card: {
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      cursor: 'pointer',
    },
  },
  media: {
    height: 150,
    borderRadius: '16px 16px 0 0',
  },
  content: {
    textAlign: 'center',
  },
  songCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    borderRadius: 8,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  songInfo: {
    flex: 1,
    marginLeft: theme.spacing(2),
  },
  songTitle: {
    fontWeight: 500,
    color: '#333',
  },
  playButton: {
    color: theme.palette.primary.main,
  },
  downloadButton: {
    color: theme.palette.secondary.main,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
}));

const ExploreMusicPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { exploreMusic, loading, error } = useSelector((state) => state.exploreMusic);

  useEffect(() => {
    dispatch(fetchExploreMusicData()); // Fetch explore music data on mount
    console.log(exploreMusic)
  }, [dispatch]);

  // Play audio
  const handlePlay = (song) => {
    dispatch(showMusicPlayer(song)); // Pass the item to the player
  };

  // Redirect to song detail page
  const handleCardClick = (id) => {
    history.push(`/songs?code=${id}`);
  };

  if (loading) {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.loader}>
        <Typography variant="h6" color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className={classes.root}>
    <Grid container spacing={4}>
      {exploreMusic.map((album) => (
        album.song_items.map((song) => (
          <Grid item xs={12} sm={6} md={3} key={song.id}>
            <Card className={classes.card} onClick={() => handleCardClick(song.id)}>
              <CardMedia
                className={classes.media}
                image={`${BACKEND_HOST}${song.cover_img}` || 'placeholder.jpg'}
                title={song.visual_desc}
              />
              <CardContent className={classes.content}>
                <Typography variant="h6">{song.variation}</Typography>
                {song.lyrics && (
                  <Typography variant="body2" color="textSecondary">
                    {song.lyrics.substring(0, 50)}...
                  </Typography>
                )}
              </CardContent>

              <div className={classes.songCard} onClick={(e) => e.stopPropagation()}>
                <div className={classes.songInfo}>
                  {/* <Typography className={classes.songTitle} variant="subtitle1">
                    {song.variation.substring(0, 20)}
                  </Typography> */}
                </div>
                <IconButton
                  className={classes.playButton}
                  onClick={() => handlePlay(song)}
                >
                  <PlayArrowIcon />
                </IconButton>
                <IconButton 
                  className={classes.downloadButton} 
                  href={song.audio_download_url} 
                  download
                >
                  <GetAppIcon />
                </IconButton>
              </div>
            </Card>
          </Grid>
        ))
      ))}
    </Grid>
  </div>
  );
};

export default ExploreMusicPage;
