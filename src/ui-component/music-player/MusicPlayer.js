import React, { useEffect, useState, useRef } from 'react';
import { Box, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import 'react-h5-audio-player/lib/styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { BACKEND_HOST } from '../../api';
import { hideMusicPlayer } from '../../store/actions';
import './styles.css';
import CalculateDateTime from '../../functions/CalculateDateTime';

const useStyles = makeStyles((theme) => ({
  musicPlayer: {
    position: 'relative',
    position: 'fixed',
    bottom: '-100%',
    left: 0,
    width: '100%',
    backgroundColor: '#5e35b1',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    transition: 'bottom 0.5s ease-in',
    zIndex: 1000,
  },
  musicPlayerVisible: {
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: '-43%',
    right: '-48%',
    color: '#fff',
    zIndex: 1001,
    opacity: 0,
    transition: 'opacity 0.3s ease-in',
  },
}));

const MusicPlayer = () => {
  const classes = useStyles();
  const { isVisible, currentSong } = useSelector((state) => state.musicPlayer);
  const dispatch = useDispatch();
  const audioRef = useRef(null); // Reference to the audio element
  const mediaSourceRef = useRef(null); // Reference to MediaSource
  const [sourceBuffer, setSourceBuffer] = useState(null); // State to hold source buffer

  const handleClose = () => {
    dispatch(hideMusicPlayer());
  };

  const fetchAndStreamAudio = async (url) => {
    try {
      const mediaSource = new MediaSource();
      mediaSourceRef.current = mediaSource;

      mediaSource.addEventListener('sourceopen', async () => {
        const audio = audioRef.current;
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        setSourceBuffer(sourceBuffer);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.status}`);
        }

        const reader = response.body.getReader();
        let isAppending = false; // Track whether an appendBuffer operation is in progress
        let chunksQueue = []; // Store chunks to append when the buffer is ready
        let isSourceBufferRemoved = false;

        const processNextChunk = () => {
          // Ensure the sourceBuffer is still valid
          if (!sourceBuffer || !mediaSource || isSourceBufferRemoved || !chunksQueue.length || isAppending) return;

          isAppending = true;
          const chunk = chunksQueue.shift();
          try {
            sourceBuffer.appendBuffer(chunk);
          } catch (error) {
            console.error("Error appending chunk:", error);
            isSourceBufferRemoved = true;
          }
        };

        sourceBuffer.addEventListener('updateend', () => {
          isAppending = false; // Mark appending as finished
          processNextChunk(); // Process the next chunk
        });

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (mediaSource.readyState === 'open') {
              mediaSource.endOfStream(); // End the stream when done, if still open
            }
            break;
          }
          chunksQueue.push(value); // Add chunk to the queue
          processNextChunk(); // Try to append the next chunk
        }
      });

      // Bind the media source object to the audio element
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(mediaSource);
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error streaming audio:", error);
    }
  };

  useEffect(() => {
    const { audio_stream_url } = currentSong?.songItem || {};

    if (audio_stream_url && audio_stream_url.includes("audiopipe.suno.ai")) {
      fetchAndStreamAudio(audio_stream_url);
    } else if (audioRef.current) {
      // For direct URLs, just set the src of the audio element
      audioRef.current.src = audio_stream_url;
      audioRef.current.play();
    }
  }, [currentSong]);

  return (
    <div className={`${classes.musicPlayer} ${isVisible ? classes.musicPlayerVisible : ''}`}>
      <Box p={1} className='row'>
        <span className={classes.closeButton} onClick={handleClose}>
          <CloseIcon style={{ fontSize: '40px', backgroundColor: '#5e35b1', borderRadius: '50%' }} />
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
            <audio ref={audioRef} controls autoPlay>
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      </Box>
    </div>
  );
}

export default MusicPlayer;
