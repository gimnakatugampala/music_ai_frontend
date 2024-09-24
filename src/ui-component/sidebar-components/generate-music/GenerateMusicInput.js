import React, { useState, useRef, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useThemeStyles } from '../../../themes/colors';
import { Typography, Chip, IconButton } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import Switch from '@material-ui/core/Switch';
import ErrorAlert from '../../../functions/ErrorAlert';
import { GenerateMusicBySongDesc, AudioStreamingAPI, GenerateTextVariations, GenerateMusicImage, AddSongDescAPI, AddSongDescItemAPI, GenerateSongByCustomLyrics, GenerateChatGPTLyricsForCustomLyrics, GenerateTextVariationsForCustomLyrics, AddSongCustomLyricsAPI, shortenLyrics, containsEnglish, GetGenreByLyrics, GenerateTranscript, BACKEND_LINK } from '../../../api';

import { useDispatch , useSelector} from 'react-redux';
import { addSong  , setLoadingSongGeneration } from '../../../store/musicActions'; // Import the action to add a song


import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import MicIcon from '@material-ui/icons/Mic';


const genres = [
  "Pop", "Rock", "Hip-Hop", "Country", "Jazz", "Classical", "Blues", 
  "Electronic", "Reggae", "Folk", "Latin", "Metal", "Punk", "Alternative", 
  "Indie", "Funk", "Gospel", "Disco", "House", "Techno", "Trance", 
  "Dubstep", "Afrobeat", "Dancehall", "K-Pop", "Trap"
];


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

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


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

      // Wait for 15 seconds before adding song items
      await delay(65000);

      // --------------------- Add Song Items sequentially ------------------
      for (let index = 0; index < audioUrls.length; index++) {

        //  Inluclude download & save audio_download_url
        const transcriptionResponse = await GenerateTranscript(audioUrls[index]);
        const transLyrics = transcriptionResponse.transcript; // Extracting the transcript text

        const songItem = {
          cover_img: musicImageResult.file_paths[index], // Set image from generated result
          visual_desc: textVariationResult.result.data.json.outputs[index]?.visual || "A description of the song's visual elements.",
          variation: textVariationResult.result.data.json.outputs[index]?.variation || "Original",
          audio_stream_url: audioUrls[index],
          audio_download_url: audioUrls[index],
          generated_song_id: Number.parseInt(songId),
          clip_id: audioUrls[index].split('/').pop().replace('.mp3', ''), // Ensure this matches your clip_id extraction logic
          genre: null,        // Optional
          lyrics: transLyrics  // Optional
        };

        try {
          // Save Song Items
          const result = await AddSongDescItemAPI(songItem);
          // await delay(3000);

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

      let textVariationResult;


      //  IF if it is english launch chatgpt lyrics ---------------
      if(containsEnglish(lyrics)){

        // Step 1: Generate ChatGPT Lyrics for Custom Lyrics
        const processedLyrics = await GenerateChatGPTLyricsForCustomLyrics(lyrics);
        const updatedLyrics = processedLyrics.result.data.json.lyricsOutput; // Extract lyricsOutput from the API response
  
        console.log("Updated Lyrics from ChatGPT API:", updatedLyrics);
  
            // Generate text variations based on updated lyrics
        // Step 2: Generate Text Variations for Custom Lyrics
        textVariationResult = await GenerateTextVariationsForCustomLyrics(updatedLyrics);


      }else{


        textVariationResult = await GenerateTextVariationsForCustomLyrics(lyrics);
      }




    // Extract visuals for music image generation
    const visuals = [
        textVariationResult.result.data.json.outputs[0]?.visual,
        textVariationResult.result.data.json.outputs[1]?.visual
    ];

      // Call APIs concurrently
      const [audioUrls, musicImageResult] = await Promise.all([
        GenerateSongByCustomLyrics(lyrics, musicStyle, textVariationResult.result.data.json.outputs[0]?.title),
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

  const handleGenreClick = (genre) => {
    setmusicStyle(genre); // Set the clicked genre in the input field
  };

const [loadingTranscription, setloadingTranscription] = useState(false)

  // Song Desc - Audio Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    setloadingTranscription(true)

    
    // Create a new FormData object and append the file
    const formData = new FormData();
    formData.append("file", file); // Appending the file that was uploaded
  
    try {
      // Upload the audio file first
      const uploadResponse = await fetch(`${BACKEND_LINK}/upload-audio/`, {
        method: "POST",
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload audio file");
      }
  
      // Parse the response to get the file URL
      const { file_url } = await uploadResponse.json();
      console.log("Audio file uploaded successfully:", file_url);
  
      // Now that the file is uploaded, call the transcription API with the file URL
      const transcriptResult = await GenerateTranscript(file_url); // Use the URL returned from the backend
      console.log("Transcription result:", transcriptResult);
  
      // Assuming the transcript is returned in the result
      // You can set the transcript or perform other actions
      setSongDesc(transcriptResult.transcript);

      setloadingTranscription(false)



      // SOng generation

      dispatch(setLoadingSongGeneration(true)); // Start loading
  
      try {
        // Call APIs concurrently
        const [audioUrls, textVariationResult, musicImageResult] = await Promise.all([
          GenerateMusicBySongDesc(transcriptResult.transcript),
          GenerateTextVariations(transcriptResult.transcript),
          GenerateMusicImage({ "visuals": [transcriptResult.transcript, transcriptResult.transcript] }),
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
  
      const addSongResponse = await AddSongDescAPI(newSong, transcriptResult.transcript);
  
      if (addSongResponse.responseCode === "200") {
        const songId = addSongResponse.responseData.id;
        console.log("Song successfully added:", addSongResponse.responseData);
  
        // Wait for 15 seconds before adding song items
        await delay(65000);
  
        // --------------------- Add Song Items sequentially ------------------
        for (let index = 0; index < audioUrls.length; index++) {
  
          //  Inluclude download & save audio_download_url
          const transcriptionResponse = await GenerateTranscript(audioUrls[index]);
          const transLyrics = transcriptionResponse.transcript; // Extracting the transcript text
  
          const songItem = {
            cover_img: musicImageResult.file_paths[index], // Set image from generated result
            visual_desc: textVariationResult.result.data.json.outputs[index]?.visual || "A description of the song's visual elements.",
            variation: textVariationResult.result.data.json.outputs[index]?.variation || "Original",
            audio_stream_url: audioUrls[index],
            audio_download_url: audioUrls[index],
            generated_song_id: Number.parseInt(songId),
            clip_id: audioUrls[index].split('/').pop().replace('.mp3', ''), // Ensure this matches your clip_id extraction logic
            genre: null,        // Optional
            lyrics: transLyrics  // Optional
          };
  
          try {
            // Save Song Items
            const result = await AddSongDescItemAPI(songItem);
            // await delay(3000);
  
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

  
    } catch (error) {
      console.error("Error during file upload or transcription:", error);
    }
  };
  


  return (
    <div>
      <Box>
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
              onChange={(e) => {
                setcustomLyrics(e.target.value)
                GetGenreByLyrics((e.target.value).replace(/\s+/g, ' ').trim(), setmusicStyle); // Pass setmusicStyle
              }}
              inputProps={{ maxLength: 1250 }}
            />

            <Box display="flex" justifyContent="flex-end" mb={1} p={1}>
              <Typography variant="caption" display="block" gutterBottom>
                {customLyrics.length} / 1250
              </Typography>
            </Box>

            <TextField
              id="outlined-multiline-static"
              fullWidth
              label="Style of music (Optional)"
              multiline
              rows={2}
              placeholder="Enter a Styles of music you want .."
              variant="outlined"
              value={musicStyle}
              onChange={(e) => setmusicStyle(e.target.value)}
              inputProps={{ maxLength: 120 }}
            />

            <Box display="flex" justifyContent="flex-end" mb={1} p={1}>
              <Typography variant="caption" display="block" gutterBottom>
                {musicStyle.length} / 120
              </Typography>
            </Box>

            <Box display="flex" overflow="auto" mb={2} p={1} style={{ whiteSpace: 'nowrap' }}>
            {genres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                onClick={() => handleGenreClick(genre)}
                style={{ marginRight: '8px', cursor: 'pointer' }}
                color={musicStyle === genre ? "primary" : "default"}
              />
            ))}
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

            <Box display="flex" justifyContent="flex-end" mb={1} p={1}>
              <Typography variant="caption" display="block" gutterBottom>
                {title.length} / 80
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
          )}


          </>
        ) : (
          <>

          

      {/* ADD UPLOAD AUDIO FILE */}

<Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          component="label"
        >
          Upload Audio File
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>

        {/* ADD FILE RECORD ICON */}
        <IconButton color="primary" aria-label="Record Audio">
          <MicIcon />
        </IconButton>
      </Box>

        {loadingTranscription && (
          <Box mx={"auto"} my={2}>
            <Typography variant="body2">Transcribing audio...</Typography>
          </Box>
        )}

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
