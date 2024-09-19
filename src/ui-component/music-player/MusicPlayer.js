import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useSelector } from 'react-redux';
import { BACKEND_HOST } from '../../api';

import './styles.css'
import constant from '../../themes/constant';
const useStyles = makeStyles((theme) => ({
  musicPlayer: {
    position: 'fixed',
    bottom: '-100%', // Start off-screen
    left: 0,
    width: '100%',
    backgroundColor: '#5e35b1',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    transition: 'bottom 0.5s ease-in-out',
    zIndex: 1000, // Ensure it appears above other elements
  },
  musicPlayerVisible: {
    bottom: 0, // End position
  },
}));
const MusicPlayer = () => {
    const classes = useStyles();
    const { isVisible, currentSong } = useSelector((state) => state.musicPlayer);

    return (
        <div className={`${classes.musicPlayer} ${isVisible ? classes.musicPlayerVisible : ''}`}>
            <Box p={1} className='row'>
                <div className='col-md-4'>
                    <div className='row'>
                        <div id="music-icon" className='col-md-6'>
                        <img 
                                src={currentSong?.songItem.cover_img ? `${BACKEND_HOST}${currentSong.songItem.cover_img}` : "default-image-url"} 
                                alt="music-icon" 
                  
                            />
                        </div>
                        <div id='music-title' className='col-md-6'>
                            <b>{currentSong?.title || "Default Title"}</b>
                            <br />
                            <div className="artist"><i>{currentSong?.songItem.artist || "Unknown Artist"}</i></div>
                        </div>
                    </div>
                </div>

                <div className='col-md-8'>
                    {isVisible && (
                        <AudioPlayer
                            autoPlay
                            src={currentSong?.songItem.audio_stream_url}
                            onPlay={e => console.log("onPlay")}
                        />
                    )}
                </div>
            </Box>
        </div>
    );
}

export default MusicPlayer;
