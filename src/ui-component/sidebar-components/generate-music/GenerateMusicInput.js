import React from 'react'
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useThemeStyles } from '../../../themes/colors';
import { Typography } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import Switch from '@material-ui/core/Switch';
import { useState } from 'react';
import ErrorAlert from '../../../functions/ErrorAlert';




const GenerateMusicInput = () => {

    const classes = useThemeStyles();
    const [lyrics, setlyrics] = useState("")
    const [songDesc, setsongDesc] = useState("")

    const [switchSingType, setswitchSingType] = useState(true)
    
      const handleChange = (event) => {
        setswitchSingType(event.target.checked)
      };


      const handleSubmitSongDescription = () =>{
        console.log(songDesc)
        console.log(switchSingType)

        if(songDesc == ""){
          ErrorAlert("Please enter song description")
          return
        }

      }


  return (
    <div>
    <Box mt={2}>

    <Box display="flex" justifyContent="flex-end" m={1} p={1}>
    <FormControlLabel
        control={<Switch checked={switchSingType}  onChange={handleChange}  />}
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
          placeholder='Enter a Lyrics on your mind...'
          variant="outlined"
          value={lyrics}
          onChange={(e) => setlyrics(e.target.value)}
          inputProps={{ maxLength: 1250 }}
        />

        <Box display="flex" justifyContent="flex-end" m={1} p={1} >
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
          <MusicNoteIcon />  Generate music
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
          placeholder='Write a description of the Song you want...'
          variant="outlined"
          value={songDesc}
          onChange={(e) => setsongDesc(e.target.value)}
          inputProps={{ maxLength: 200 }}
        />

      <Box display="flex" justifyContent="flex-end" m={1} p={1} >
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
          <MusicNoteIcon />  Generate music
        </Button>
        </Box>


      </>
    )}


    </Box>
    </div>
  )
}

export default GenerateMusicInput