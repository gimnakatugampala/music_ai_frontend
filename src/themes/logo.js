import React from 'react'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import constant from './constant';

const useStyles = makeStyles({
  root: {
    color: constant.PrimaryColor
  },
});

const Logo = () => {

    const classes = useStyles()

  return (
    <Typography className={classes.root} variant="h2" gutterBottom>
            MUSIC.AI
      </Typography>
  )
}

export default Logo