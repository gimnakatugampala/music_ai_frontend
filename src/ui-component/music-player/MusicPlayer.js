import React from 'react';
import { Box, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'; // Import close icon
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { BACKEND_HOST } from '../../api';
import { hideMusicPlayer } from '../../store/actions'; // Import the action

import './styles.css';
import constant from '../../themes/constant';
import CalculateDateTime from '../../functions/CalculateDateTime';

const useStyles = makeStyles((theme) => ({
  musicPlayer: {
    position: 'relative',
    position: 'fixed',
    bottom: '-100%', // Start off-screen
    left: 0,
    width: '100%',
    backgroundColor: '#5e35b1',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    transition: 'bottom 0.5s ease-in',
    zIndex: 1000, // Ensure it appears above other elements
    '&:hover $closeButton': {
      opacity: 1, // Show close button on hover
    },
  },
  musicPlayerVisible: {
    bottom: 0, // End position
  },
  closeButton: {
    position: 'absolute', // Position absolutely
    top: '-43%',          // Align 10px from the top
    right: '-48%',       // Align 10px from the right
    color: '#fff',        // White color for contrast
    zIndex: 1001,    // Higher than the music player itself
    opacity: 0, // Initially hidden
    transition: 'opacity 0.3s ease-in',
  },
}));

const MusicPlayer = () => {
  const classes = useStyles();
  const { isVisible, currentSong } = useSelector((state) => state.musicPlayer);
  const dispatch = useDispatch(); // Initialize dispatch

  // Close player handler
  const handleClose = () => {
    dispatch(hideMusicPlayer()); // Dispatch the hide action
  };

  return (
    <div className={`${classes.musicPlayer} ${isVisible ? classes.musicPlayerVisible : ''}`}>
      <Box p={1} className='row'>
{/* Close button */}
<span className={classes.closeButton} onClick={handleClose}>
          <CloseIcon style={{fontSize:'40px',backgroundColor:'#5e35b1',borderRadius:'50%'}} />
        </span>
        

        <div className='col-md-4'>
          <div className='row'>
            <div id="music-icon" className='col-md-6'>
              <img 
                src={currentSong?.songItem?.cover_img ? `${BACKEND_HOST}${currentSong.songItem.cover_img}` : "default-image-url"} 
                alt="music-icon" 
              />
            </div>
            <div id='music-title' className='col-md-6'>
              <b>{currentSong?.title || "Default Title"}</b>
              <br />
              <div className="artist">
                <i>{CalculateDateTime(currentSong?.created_date)}</i>
              </div>
            </div>
          </div>
        </div>

        <div className='col-md-8'>
        
          {isVisible && (
            <AudioPlayer
              autoPlay
              src={currentSong?.songItem?.audio_stream_url}
              onPlay={(e) => console.log("onPlay")}
            />
          )}
        </div>
      </Box>
    </div>
  );
}

export default MusicPlayer;
