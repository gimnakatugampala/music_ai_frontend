import React from 'react'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import constant from './constant';
import logo from '../assets/images/music_ai_logo.png'

const useStyles = makeStyles({
  root: {
    color: constant.PrimaryColor
  },
});

const Logo = () => {

    const classes = useStyles()

  return (
    // <Typography className={classes.root} variant="h2" gutterBottom>
            <img src={logo} alt='logo' width='150px' />
      // </Typography>
  )
}

export default Logo