import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, CircularProgress, Grid, Chip } from '@material-ui/core';
import { BACKEND_HOST, GetSongByID } from '../../api'; // Ensure this path is correct
import CalculateDateTime from '../../functions/CalculateDateTime';

import AudioPlayer from 'react-h5-audio-player'; // Import react-h5-audio-player
import 'react-h5-audio-player/lib/styles.css'; // Import player styles

const Index = () => {
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
                      {item.lyrics.split(/,\s*/).map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < item.lyrics.split(/,\s*/).length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <img 
                      src={`${BACKEND_HOST}${item.cover_img}`} 
                      alt={item.visual_desc} 
                      style={{ width: '400px', height: '400px', borderRadius: '8px' }} 
                    />
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
