import React, { useState, useRef, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useThemeStyles } from '../../../themes/colors';
import { Typography } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import Switch from '@material-ui/core/Switch';
import ErrorAlert from '../../../functions/ErrorAlert';
import { GenerateMusicBySongDesc, AudioStreamingAPI, AudioSreamingAPI, GenerateTextVariations, GenerateMusicImage } from '../../../api';

const GenerateMusicInput = () => {
  const classes = useThemeStyles();
  const [lyrics, setLyrics] = useState("");
  const [songDesc, setSongDesc] = useState("");
  const [switchSingType, setSwitchSingType] = useState(true);
  const [audioUrls, setAudioUrls] = useState([]); // state for storing audio URLs

  const [textVariations, settextVariations] = useState(null)



  const handleChange = (event) => {
    setSwitchSingType(event.target.checked);
  };

  // Generate Song by description
  const handleSubmitSongDescription = async () => {
    if (songDesc === "") {
      ErrorAlert("Please enter a song description");
      return;
    }
  
    try {
      console.log("Calling GenerateTextVariations and GenerateMusicImage APIs simultaneously...");
  
      // 1. Prepare the visual data for GenerateMusicImage
      const visuals = [songDesc, songDesc]; // Hardcoded visuals for the example, or you can adjust this based on user input
  
      // 2. Trigger both API calls without waiting for one to finish
      const generateTextVariationsPromise = GenerateTextVariations(songDesc, (result) => {
        console.log("Text variations generated:", result);
        settextVariations(result); // You can set the variations here
  
        // If you still need something from GenerateTextVariations for GenerateMusicImage,
        // you can conditionally trigger another call here.
      });
  
      const generateMusicImagePromise = GenerateMusicImage({visuals});
  
      // 3. Use Promise.all() to ensure both APIs finish but do not wait for each other.
      const [textVariationsResult, musicImageResult] = await Promise.all([
        generateTextVariationsPromise,
        generateMusicImagePromise
      ]);
  
      // 4. Process both results as needed
      console.log("Text Variations Result:", textVariationsResult);
      console.log("Music Image Result:", musicImageResult);
  
    } catch (error) {
      console.error("Error in handleSubmitSongDescription:", error);
      ErrorAlert("Error generating music.");
    }
  };
  

  // Handle the onCanPlay event to start playback

  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const blob = await AudioSreamingAPI();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch audio:", error);
        setLoading(false);
      }
    };

    fetchAudio();
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <Box mt={2}>
        <Box display="flex" justifyContent="flex-end" m={1} p={1}>
          <FormControlLabel
            control={<Switch checked={switchSingType} onChange={handleChange} />}
            label="Custom Lyrics"
          />
        </Box>

        {switchSingType ? (
          <>
            <TextField
              id="outlined-multiline-static"
              fullWidth
              label="Lyrics"
              multiline
              rows={10}
              placeholder="Enter a Lyrics on your mind..."
              variant="outlined"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              inputProps={{ maxLength: 1250 }}
            />

            <Box display="flex" justifyContent="flex-end" m={1} p={1}>
              <Typography variant="caption" display="block" gutterBottom>
                {lyrics.length} / 1250
              </Typography>
            </Box>

            <Box my={2}>
              <Button
                disableElevation
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                className={classes.login}
              >
                <MusicNoteIcon /> Generate music
              </Button>
            </Box>
          </>
        ) : (
          <>
            <TextField
              id="outlined-multiline-static"
              fullWidth
              label="Song Description"
              multiline
              rows={5}
              placeholder="Write a description of the Song you want..."
              variant="outlined"
              value={songDesc}
              onChange={(e) => setSongDesc(e.target.value)}
              inputProps={{ maxLength: 200 }}
            />

            <Box display="flex" justifyContent="flex-end" m={1} p={1}>
              <Typography variant="caption" display="block" gutterBottom>
                {songDesc.length} / 200
              </Typography>
            </Box>

            <Box my={2}>
              <Button
                onClick={handleSubmitSongDescription}
                disableElevation
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                className={classes.login}
              >
                <MusicNoteIcon /> Generate music
              </Button>
            </Box>
          </>
        )}

        {/* Display audio clips */}
        <Box mt={2}>
      {loading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : audioUrl ? (
        <div>
          <Typography variant="h6">Generated Music Clip</Typography>
          <audio
            ref={audioRef}
            controls
            src={audioUrl}
            style={{ width: '100%' }}
          >
            Your browser does not support the audio element.
          </audio>
          <Button onClick={handlePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      ) : (
        <Typography variant="body1">No audio available</Typography>
      )}
    </Box>
      </Box>
    </div>
  );
};

export default GenerateMusicInput;
