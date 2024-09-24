import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, CircularProgress, Grid, Chip , IconButton } from '@material-ui/core';
import { BACKEND_HOST, GetSongByID } from '../../api'; // Ensure this path is correct
import CalculateDateTime from '../../functions/CalculateDateTime';

import AudioPlayer from 'react-h5-audio-player'; // Import react-h5-audio-player
import 'react-h5-audio-player/lib/styles.css'; // Import player styles

import XTwitterImg from '../../assets/images/icons/twitter.png'; // Twitter image
import FacebookImg from '../../assets/images/icons/facebook.png'; // Facebook image
import WhatsappImg from '../../assets/images/icons/whatsapp.png'; // Facebook image
import MailImg from '../../assets/images/icons/mail.png'; // Facebook image

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: theme.spacing(4),
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
    },
    searchField: {
      marginBottom: theme.spacing(2),
    },
    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    },
    list: {
      padding: 0,
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(2),
      margin: theme.spacing(1, 0),
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.2s, box-shadow 0.2s',
      '&:hover': {
        backgroundColor: '#e0e0e0',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      },
    },
    playingItem: {
      backgroundColor: '#d0f0c0',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    coverImage: {
      width: 50,
      height: 50,
    },
    title: {
      fontWeight: 'bold',
    },
    variation: {
      color: theme.palette.text.secondary,
    },
    playButton: {
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    },
    actionButton: {
      marginLeft: theme.spacing(1), // Space between icons
    },
    dialogActions: {
      justifyContent: 'center',
    },
    socialMediaIcon: {
      width: 40, // You can adjust the size of the image here
      height: 40,
      marginRight: theme.spacing(1),
    },
  }));


const Index = () => {
    const classes = useStyles();
  const location = useLocation();
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(1);
  const audioRef = React.useRef(null);

  // Function to get the code from the query parameters
  const getCodeFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('code'); // Returns the song ID from query parameters
  };

  const code = getCodeFromUrl();

  useEffect(() => {
    const fetchSongData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (code) {
          const result = await GetSongByID(code); // Fetch song data using the API function
          setSongData(result.responseData[0]); // Assuming responseData is an array
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongData();
  }, [code]);


  const handleShareToFacebook = () => {
    const songLink = `${window.location.origin}/songs?code=${songData.song_items[0].id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${songLink}`, '_blank');
  };

  const handleShareToTwitter = () => {
    const songLink = `${window.location.origin}/songs?code=${songData.song_items[0].id}`;
    window.open(`https://twitter.com/intent/tweet?url=${songLink}`, '_blank');
  };

  const handleShareToWhatsapp = () => {
    const songLink = `${window.location.origin}/songs?code=${songData.song_items[0].id}`;
    const whatsappMessage = `Check out this song: ${songLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };
  
  const handleShareToEmail = () => {
    const songLink = `${window.location.origin}/songs?code=${songData.song_items[0].id}`;
    const subject = encodeURIComponent(`Check out this song: ${songData.song_items[0].title}`);
    const body = encodeURIComponent(`I found this song you might like: ${songLink}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!songData) {
    return <Typography>No song data found.</Typography>;
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h4" gutterBottom style={{ fontSize: '2rem', textAlign: 'left' }}>
          {songData.title}
        </Typography>
        <Typography variant="h6" gutterBottom style={{ textAlign: 'left' }}>
          <i>Generated: {CalculateDateTime(songData.created_date)}</i>
        </Typography>
        <Grid container spacing={1}>
          {songData.song_items.map(item => (
            <React.Fragment key={item.id}>

              <Grid item xs={12}>

                <Grid container spacing={2}>

                <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'column' }}>

                  <Grid className='my-2' container spacing={1}>
                  <Grid item xs={12} sm={10}>
                    <div className='mt-3'>
                      <h5><b>Description</b></h5>
                      <h6>{item.visual_desc}</h6>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <div className='mt-3'>
                      <h5><b>Genre</b></h5>
                      <Chip label={item.genre || 'N/A'} color={item.genre ? 'default' : 'default'} />
                    </div>
                </Grid>
                </Grid>


                <div className='my-3'>
  <h5><b>Lyrics</b></h5>
  {item.lyrics ? ( // Check if lyrics exists
    item.lyrics.split(/,\s*/).map((line, index) => (
      <span key={index}>
        {line}
        {index < item.lyrics.split(/,\s*/).length - 1 && <br />}
      </span>
    ))
  ) : ( // If lyrics is not available, show a fallback message
    <Typography color="textSecondary">No lyrics available.</Typography>
  )}
</div>
                  </Grid>


                  <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <img 
                      src={`${BACKEND_HOST}${item.cover_img}`} 
                      alt={item.visual_desc} 
                      style={{ width: '400px', height: '400px', borderRadius: '8px' }} 
                    />
                  </Grid>

                <Grid item xs={12} sm={11} mx={"auto"} style={{ display: 'flex', justifyContent: 'flex-end'  }}>
                  <IconButton onClick={handleShareToFacebook}>
                    <img src={FacebookImg} alt="Facebook" className={classes.socialMediaIcon} />
                    </IconButton>
                    <IconButton onClick={handleShareToTwitter}>
                    <img src={XTwitterImg} alt="Twitter" className={classes.socialMediaIcon} />
                    </IconButton>
                    <IconButton onClick={handleShareToWhatsapp}>
                    <img src={WhatsappImg} alt="Whatsapp" className={classes.socialMediaIcon} />
                    </IconButton>
                    <IconButton onClick={handleShareToEmail}>
                    <img src={MailImg} alt="Email" className={classes.socialMediaIcon} />
                    </IconButton>
                </Grid>

                </Grid>
              </Grid>

              <Grid item mx={"auto"} xs={8} my={4}>
                <AudioPlayer
                  autoPlay
                  ref={audioRef} // Set ref to access audio element inside the player
                  src={`${item.audio_stream_url}`} // Add the audio stream URL here
                  onPlay={() => console.log("onPlay")}
                  customAdditionalControls={[]} // Optionally customize the controls
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Index;
