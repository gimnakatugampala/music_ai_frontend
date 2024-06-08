import React from 'react'
import {Box, Grid, Typography, makeStyles} from '@material-ui/core';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useSelector } from 'react-redux';


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
    const isVisible = useSelector((state) => state.musicPlayer.isVisible);

// {/* <div id="music-bar"> */}
  return (
    <div className={`${classes.musicPlayer} ${isVisible ? classes.musicPlayerVisible : ''}`} >
    
    <Box p={1} className='row'>
        <div className='col-md-4'>

            <div className='row'>
      
                <div id="music-icon" className='col-md-6'>
                    <img src="https://api.riffusion.com/storage/v1/object/public/images/private/22e45a62-48c5-4e80-8fed-ba1ae4b456ad.jpg" alt="music-icon" />
                </div>
        

            <div id='music-title' className='col-md-6'>
                <b>Timeless Dreams Smiles</b>
                <br />
                <div className="artist"><i>by music.ai</i></div>
            </div>
            </div>
            </div>

            <div className='col-md-8'>
                
                {isVisible && (

            <AudioPlayer
           
            autoPlay
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            onPlay={e => console.log("onPlay")}
            // other props here
        />
              
                )}

            </div>
            
    </Box>
    
    </div>
  )
}

export default MusicPlayer