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
import { GenerateMusicBySongDesc, AudioStreamingAPI, GenerateTextVariations, GenerateMusicImage, AddSongDescAPI, AddSongDescItemAPI } from '../../../api';

import { useDispatch } from 'react-redux';
import { addSong } from '../../../store/musicActions'; // Import the action to add a song


const GenerateMusicInput = () => {
  const classes = useThemeStyles();

  const dispatch = useDispatch(); // Initialize dispatch


  const [lyrics, setLyrics] = useState("");
  const [songDesc, setSongDesc] = useState("");
  const [switchSingType, setSwitchSingType] = useState(true);
  const [audioUrls, setAudioUrls] = useState([]); // state for storing audio URLs

  const [textVariations, settextVariations] = useState(null)
  const [generatedImages, setgeneratedImages] = useState(null)

  const [audioBlobsUrls, setaudioBlobsUrls] = useState([])



  const handleChange = (event) => {
    setSwitchSingType(event.target.checked);
  };

  // Generate Song by description
  const handleSubmitSongDescription = async () => {
    if (songDesc == "") {
      ErrorAlert("Please enter song description");
      return;
    }
  
    try {
      // Call APIs concurrently
      const [audioUrls, textVariationResult, musicImageResult] = await Promise.all([
        GenerateMusicBySongDesc(songDesc),
        GenerateTextVariations(songDesc),
        GenerateMusicImage({ "visuals": [songDesc, songDesc] }),
      ]);
  
       // After all APIs have resolved, handle the results
      setAudioUrls(audioUrls); // Assuming you want to store audio URLs in state
      console.log("Generated audio URLs:", audioUrls);
  
      settextVariations(textVariationResult); // Set text variations
      console.log("Generated text variations:", textVariationResult);
  
      setgeneratedImages(musicImageResult); // Set generated images
      console.log("Generated music images:", musicImageResult);
  
      // Create audioStreamUrls from the audio URLs
         // Sequentially fetch and convert audio URLs to blob URLs
    const fetchAudioSequentially = async (urls) => {
      const audioBlobUrls = [];

      for (const url of urls) {
        try {
          console.log(`Fetching audio from URL: ${url}`);
          const audioBlob = await AudioStreamingAPI(url);
          const audioStreamUrl = URL.createObjectURL(audioBlob);
          audioBlobUrls.push(audioStreamUrl);
          console.log(`Successfully fetched and created URL for: ${url}`);
        } catch (error) {
          console.error(`Failed to fetch audio from URL: ${url}`, error);
          // Optionally handle or log the error as needed
        }
      }

      return audioBlobUrls;
    };

    // Fetch audio blobs and get URLs
    const audioStreamUrls = await fetchAudioSequentially();

    console.log("Audio stream URLs:", audioStreamUrls);
    setaudioBlobsUrls(audioStreamUrls);

    // Temperory Song Data
    const newSong = {
      id: Date.now(), // Temporary unique ID, you can update this based on actual response
      title: textVariationResult.result.data.json.outputs[0]?.title, // Set title from generated result
      created_date: new Date().toISOString(), // Set creation date
      song_items: audioStreamUrls.map((streamUrl, index) => {
        // Extract the clip ID from audio URL by removing everything before the last '/'
        const clip_id = streamUrl.split('/').pop()
    
        return {
          id: index + 1,
          cover_img: musicImageResult.file_paths[index], // Set image from generated result
          visual_desc: textVariationResult.result.data.json.outputs[index]?.visual || "A description of the song's visual elements.",
          variation: textVariationResult.result.data.json.outputs[index]?.variation || "Original", // Set variation from generated result
          audio_stream_url: streamUrl, // Set the audio stream URL (blob URL)
          audio_download_url: streamUrl, // Same blob URL for download
          generated_song_id: index + 1,
          clip_id: clip_id, // Set extracted clip ID
        };
      }),
    };
    

    console.log(newSong)

    dispatch(addSong(newSong));

    // ------------- Save Song ---------------

    const addSongResponse = await AddSongDescAPI(newSong, songDesc);

    if (addSongResponse.responseCode === "200") {
      const songId = addSongResponse.responseData.id;
      console.log("Song successfully added:", addSongResponse.responseData);

      // --------------------- Add Song Items sequentially ------------------
      for (let index = 0; index < audioUrls.length; index++) {

        //  Inluclude download & save audio_download_url
        

        const songItem = {
          cover_img: musicImageResult.file_paths[index], // Set image from generated result
          visual_desc: textVariationResult.result.data.json.outputs[index]?.visual || "A description of the song's visual elements.",
          variation: textVariationResult.result.data.json.outputs[index]?.variation || "Original",
          audio_stream_url: audioUrls[index],
          audio_download_url: audioUrls[index],
          generated_song_id: Number.parseInt(songId),
          clip_id: audioUrls[index].split('/').pop().replace('.mp3', '') // Ensure this matches your clip_id extraction logic
        };

        try {
          // Save Song Items
          const result = await AddSongDescItemAPI(songItem);

          console.log("Song item added successfully:", result);

        } catch (error) {
          console.error("Failed to add song item:", error);
        }
      }

      console.log("All song items added successfully.");
    } else {
      ErrorAlert("Failed to add song.");
    }



    // Save Song Item
  
      // // Create a new song object to be added to Redux
      // const newSong = {
      //   id: Date.now(), // Temporary unique ID, you can update this based on actual response
      //   title: "Generated Song", // Add any title logic if needed
      //   created_date: new Date().toISOString(), // Set creation date
      //   song_items: audioStreamUrls.map((streamUrl, index) => ({
      //     id: index + 1,
      //     cover_img: musicImageResult[0]?.url, // Set image from generated result
      //     visual_desc: "A description of the song's visual elements.",
      //     variation: textVariationResult[index]?.variation || "Original", // Set variation from generated result
      //     audio_stream_url: streamUrl, // Set the audio stream URL (blob URL)
      //     audio_download_url: streamUrl, // Same blob URL for download
      //     generated_song_id: index + 1,
      //     clip_id: 123 + index, // Example clip ID, adjust if needed
      //   })),
      // };
  
      // // Dispatch the addSong action to add the new song to the Redux store
      // dispatch(addSong(newSong));
  
    } catch (error) {
      console.error("Error in handleSubmitSongDescription:", error);
      ErrorAlert("Error generating music.");
    }
  };

  useEffect(() => {

    // Temperory Data
      //  const newSong = {
      //   id: Date.now(), // Temporary unique ID, you can update this based on actual response
      //   title: textVariations.result.data.json.outputs[0]?.title, // Add any title logic if needed
      //   created_date: new Date().toISOString(), // Set creation date
      //   song_items: audioBlobsUrls.map((streamUrl, index) => ({
      //     id: index + 1,
      //     cover_img: generatedImages.file_paths[index], // Set image from generated result
      //     visual_desc: textVariations.result.data.json.outputs[index]?.visual || "A description of the song's visual elements.",
      //     variation: textVariations.result.data.json.outputs[index]?.variation || "Original", // Set variation from generated result
      //     audio_stream_url: streamUrl, // Set the audio stream URL (blob URL)
      //     audio_download_url: streamUrl, // Same blob URL for download
      //     generated_song_id: index + 1,
      //     clip_id: streamUrl.match(/\/([a-z0-9-]+)\.mp3$/i)[1], // Example clip ID, adjust if needed
      //   })),
      // };


      // Download the audio from the cdn link API

      // Save to the DB

      // console.log(newSong)
  
  }, []);
  


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

     
      </Box>
    </div>
  );
};

export default GenerateMusicInput;
