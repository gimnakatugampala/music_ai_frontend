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
import { GenerateMusicBySongDesc, AudioStreamingAPI, GenerateTextVariations, GenerateMusicImage, AddSongDescAPI, AddSongDescItemAPI, GenerateSongByCustomLyrics, GenerateChatGPTLyricsForCustomLyrics, GenerateTextVariationsForCustomLyrics, AddSongCustomLyricsAPI } from '../../../api';

import { useDispatch , useSelector} from 'react-redux';
import { addSong  , setLoadingSongGeneration } from '../../../store/musicActions'; // Import the action to add a song


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

  const { loadingSongGeneration  } = useSelector((state) => state.music || {});


  // ------------ CUSTOM LYRICS --------
  const [customLyrics, setcustomLyrics] = useState("")
  const [musicStyle, setmusicStyle] = useState("")
  const [title, settitle] = useState("")




  const handleChange = (event) => {
    setSwitchSingType(event.target.checked);
  };

  // Generate Song by description
  const handleSubmitSongDescription = async () => {
    if (songDesc == "") {
      ErrorAlert("Please enter song description");
      return;
    }

    dispatch(setLoadingSongGeneration(true)); // Start loading
  
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
  
    // Usage in your song items mapping
    const newSong = {
      id: Date.now(),
      title: textVariationResult.result.data.json.outputs[0]?.title,
      created_date: new Date().toISOString(),
      song_items: audioUrls.map((streamUrl, index) => {
        const clip_id = streamUrl.split('/').pop().replace('.mp3', '');
    
        return {
          id: index + 1,
          cover_img: musicImageResult.file_paths[index],
          visual_desc: textVariationResult.result.data.json.outputs[index]?.visual || "A description of the song's visual elements.",
          variation: textVariationResult.result.data.json.outputs[index]?.variation || "Original",
          audio_stream_url: `https://audiopipe.suno.ai/?item_id=${clip_id}`, // Use the blob URL for playback
          audio_download_url: `https://audiopipe.suno.ai/?item_id=${clip_id}`, // Same for download
          generated_song_id: index + 1,
          clip_id: clip_id
        };
      }),
    };
    
    console.log(newSong);

    dispatch(addSong(newSong));

    dispatch(setLoadingSongGeneration(false)); 

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
          clip_id: audioUrls[index].split('/').pop().replace('.mp3', ''), // Ensure this matches your clip_id extraction logic
          genre: null,        // Optional
          lyrics: null  // Optional
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


  
    } catch (error) {
      console.error("Error in handleSubmitSongDescription:", error);
      ErrorAlert("Error generating music.");
    }
  };


  // Generate Song by Custom Lyrics
  const handleSubmitSongByCustomLyrics = async() => {
    console.log(customLyrics)

    if(customLyrics == ""){
      ErrorAlert("Please enter your lyrics");
      return;
    }

    let lyrics = customLyrics.replace(/\s+/g, ' ').trim()

 

     
    try {

      dispatch(setLoadingSongGeneration(true)); // Start loading

        // Step 1: Generate ChatGPT Lyrics for Custom Lyrics
        // const processedLyrics = await GenerateChatGPTLyricsForCustomLyrics(lyrics);
        // const updatedLyrics = processedLyrics.result.data.json.lyricsOutput; // Extract lyricsOutput from the API response

        // console.log("Updated Lyrics from ChatGPT API:", updatedLyrics);

            // Generate text variations based on updated lyrics
    const textVariationResult = await GenerateTextVariationsForCustomLyrics(lyrics);

    // Extract visuals for music image generation
    const visuals = [
        textVariationResult.result.data.json.outputs[0]?.visual,
        textVariationResult.result.data.json.outputs[1]?.visual
    ];

      // Call APIs concurrently
      const [audioUrls, musicImageResult] = await Promise.all([
        GenerateSongByCustomLyrics(lyrics, musicStyle),
        GenerateMusicImage({ "visuals": visuals }),
      ]);
  
       // After all APIs have resolved, handle the results
      setAudioUrls(audioUrls); // Assuming you want to store audio URLs in state
      console.log("Generated audio URLs:", audioUrls);
  
      settextVariations(textVariationResult); // Set text variations
      console.log("Generated text variations:", textVariationResult);
  
      setgeneratedImages(musicImageResult); // Set generated images
      console.log("Generated music images:", musicImageResult);
  
    // Usage in your song items mapping
    const newSong = {
      id: Date.now(),
      title: title == "" ?  textVariationResult.result.data.json.outputs[0]?.title : `${textVariationResult.result.data.json.outputs[0]?.title} (${title})`,
      created_date: new Date().toISOString(),
      song_items: audioUrls.map((streamUrl, index) => {
        const clip_id = streamUrl.split('/').pop().replace('.mp3', '');
    
        return {
          id: index + 1,
          cover_img: musicImageResult.file_paths[index],
          visual_desc: textVariationResult.result.data.json.outputs[index]?.visual || "A description of the song's visual elements.",
          variation: textVariationResult.result.data.json.outputs[index]?.variation || "Original",
          audio_stream_url: `https://audiopipe.suno.ai/?item_id=${clip_id}`, // Use the blob URL for playback
          audio_download_url: `https://audiopipe.suno.ai/?item_id=${clip_id}`, // Same for download
          generated_song_id: index + 1,
          clip_id: clip_id
        };
      }),
    };
    
    console.log(newSong);

    dispatch(addSong(newSong));

    dispatch(setLoadingSongGeneration(false)); 

    // ------------- Save Song ---------------

    const addSongResponse = await AddSongCustomLyricsAPI(newSong, lyrics);

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
          clip_id: audioUrls[index].split('/').pop().replace('.mp3', ''), // Ensure this matches your clip_id extraction logic
          genre: musicStyle,        // Optional
          lyrics: lyrics  // Optional
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
      dispatch(setLoadingSongGeneration(false)); // Start loading
    }


  
    } catch (error) {
      console.error("Error in handleSubmitSongDescription:", error);
      dispatch(setLoadingSongGeneration(false)); // Start loading
      ErrorAlert("Error generating music.");
    }

    console.log(lyrics)
    console.log(musicStyle)
    console.log(title)
  }


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
              value={customLyrics}
              onChange={(e) => setcustomLyrics(e.target.value)}
              inputProps={{ maxLength: 1250 }}
            />

            <Box display="flex" justifyContent="flex-end" m={1} p={1}>
              <Typography variant="caption" display="block" gutterBottom>
                {customLyrics.length} / 1250
              </Typography>
            </Box>

            <TextField
              id="outlined-multiline-static"
              fullWidth
              label="Style of music (Optional)"
              multiline
              rows={3}
              placeholder="Enter a Styles of music you want .."
              variant="outlined"
              value={musicStyle}
              onChange={(e) => setmusicStyle(e.target.value)}
              inputProps={{ maxLength: 120 }}
            />

            <Box display="flex" justifyContent="flex-end" m={1} p={1}>
              <Typography variant="caption" display="block" gutterBottom>
                {musicStyle.length} / 120
              </Typography>
            </Box>


            <TextField
              id="outlined-multiline-static"
              fullWidth
              label="Title for the Song (Optional)"
              multiline
              rows={1}
              placeholder="Enter a Title for your song .."
              variant="outlined"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              inputProps={{ maxLength: 80 }}
            />

            <Box display="flex" justifyContent="flex-end" m={1} p={1}>
              <Typography variant="caption" display="block" gutterBottom>
                {title.length} / 80
              </Typography>
            </Box>


            <Box my={2}>
              <Button
                onClick={handleSubmitSongByCustomLyrics}
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

            

            {loadingSongGeneration ? (

              <Box my={2}>
                <Button
                  disableElevation
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  className={classes.login}
                >
                  Generating ..
                </Button>
              </Box>

            ) : (

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

            )}




          </>
        )}

     
      </Box>
    </div>
  );
};

export default GenerateMusicInput;
