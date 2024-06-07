import React from 'react'
import {Box, Grid, Typography} from '@material-ui/core';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import './styles.css'
import constant from '../../themes/constant';
const MusicPlayer = () => {
  return (
    <div id="music-bar">
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
                
            <AudioPlayer
            // style={{backgroundColor:constant.PrimaryColor,boxShadow:0}}
            autoPlay
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            onPlay={e => console.log("onPlay")}
            // other props here
        />
              

            </div>
            
    </Box>
    </div>
  )
}

export default MusicPlayer