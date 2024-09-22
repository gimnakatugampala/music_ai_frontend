import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { BACKEND_HOST } from '../../api';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  albumTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
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
}));

const ExploreMusicPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [currentSong, setCurrentSong] = useState(null);
  const [audio] = useState(new Audio());

  const musicData = [
    {
      id: 93,
      title: "Time's Melody Unbound",
      created_date: '2024-09-22T08:46:35',
      song_items: [
        {
          id: 150,
          cover_img: 'images/image_372dc6c9-24cf-400f-a1c2-e828668c3a95.jpeg',
          visual_desc: 'An abstract hourglass with dreamlike colors and flowing sand',
          variation: 'Conceptual exploration of time',
          lyrics: 'Time flows as a river...',
          audio_stream_url: 'https://example.com/song1.mp3',
          audio_download_url: 'https://example.com/download/song1.mp3',
        },
        {
          id: 151,
          cover_img: 'images/image_a86de437-1280-4266-9c06-382cd9708156.jpeg',
          visual_desc: 'Mountain ranges at dawn',
          variation: 'Nature-inspired harmonic',
          lyrics: 'The dawn breaks on the mountains...',
          audio_stream_url: 'https://example.com/song2.mp3',
          audio_download_url: 'https://example.com/download/song2.mp3',
        },
      ],
    },
    // Add more albums with song items as needed
  ];

  // Flatten the song items from all albums
  const allSongs = musicData.flatMap((album) => album.song_items);

  // Play audio
  const handlePlay = (song) => {
    if (currentSong === song.id) {
      audio.pause();
      setCurrentSong(null);
    } else {
      audio.src = song.audio_stream_url;
      audio.play();
      setCurrentSong(song.id);
    }
  };

  // Redirect to song detail page
  const handleCardClick = (id) => {
    history.push(`/songs?code=${id}`);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {allSongs.map((song) => (
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
                  <Typography className={classes.songTitle} variant="subtitle1">
                    {song.variation}
                  </Typography>
                </div>
                <IconButton
                  className={classes.playButton}
                  onClick={() => handlePlay(song)}
                >
                  <PlayArrowIcon />
                </IconButton>
                <IconButton className={classes.downloadButton} href={song.audio_download_url} download>
                  <GetAppIcon />
                </IconButton>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ExploreMusicPage;
