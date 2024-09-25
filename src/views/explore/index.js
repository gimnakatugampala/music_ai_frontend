import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, IconButton, CircularProgress,Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@material-ui/core';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { BACKEND_HOST } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { showMusicPlayer } from '../../store/actions';
import { fetchExploreMusicData } from '../../store/exploreMusicActions';
import ShareIcon from '@material-ui/icons/Share';


import FileCopyIcon from '@material-ui/icons/FileCopy'; // For copy icon
import XTwitterImg from '../../assets/images/icons/twitter.png'; // Twitter image
import FacebookImg from '../../assets/images/icons/facebook.png'; // Facebook image
import WhatsappImg from '../../assets/images/icons/whatsapp.png'; // Facebook image
import MailImg from '../../assets/images/icons/mail.png'; // Facebook image

import { saveAs } from 'file-saver';





const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  card: {
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      cursor: 'pointer',
    },
  },
  highlightedCard: {
    border: `2px solid ${theme.palette.primary.main}`, // Highlight border color
  },
  media: {
    height: 150,
    borderRadius: '16px 16px 0 0',
  },
  content: {
    textAlign: 'center',
  },
  songCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    borderRadius: 8,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  songInfo: {
    flex: 1,
    marginLeft: theme.spacing(2),
  },
  playButton: {
    color: theme.palette.primary.main,
  },
  downloadButton: {
    color: theme.palette.secondary.main,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  actionButton: {
    marginLeft: theme.spacing(1), // Space between icons
  },
  dialogActions: {
    justifyContent: 'center',
  },
  socialMediaIcon: {
    width: 40, // You can adjust the size of the image here
    height: 40,
    marginRight: theme.spacing(1),
  },
  shareButton: {
    color: theme.palette.secondary.main, // Change color as needed
    '&:hover': {
      backgroundColor: theme.palette.action.hover, // Optional hover effect
    },
  }
}));

const ExploreMusicPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { exploreMusic, loading, error } = useSelector((state) => state.exploreMusic);
  
  const [playingSongId, setPlayingSongId] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    dispatch(fetchExploreMusicData());
  }, [dispatch]);

  const handlePlay = (song, album) => {
    if (playingSongId === song.id) {
      setPlayingSongId(null);
    } else {
      setPlayingSongId(song.id);
      const item = {
        created_date: album.created_date,
        title: album.title,
        songItem: song,
      };
      dispatch(showMusicPlayer(item));
    }
  };

  const handleCardClick = (id) => {
    history.push(`/songs?code=${id}`);
  };


  const handleShare = (song) => {
    setSelectedSong(song);
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };

  const copyLinkToClipboard = () => {
    const songLink = `${window.location.origin}/songs?code=${selectedSong.id}`;
    navigator.clipboard.writeText(songLink);
  };

  const handleShareToFacebook = () => {
    const songLink = `${window.location.origin}/songs?code=${selectedSong.id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${songLink}`, '_blank');
  };

  const handleShareToTwitter = () => {
    const songLink = `${window.location.origin}/songs?code=${selectedSong.id}`;
    window.open(`https://twitter.com/intent/tweet?url=${songLink}`, '_blank');
  };

  const handleShareToWhatsapp = () => {
    const songLink = `${window.location.origin}/songs?code=${selectedSong.id}`;
    const whatsappMessage = `Check out this song: ${songLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };
  
  const handleShareToEmail = () => {
    const songLink = `${window.location.origin}/songs?code=${selectedSong.id}`;
    const subject = encodeURIComponent(`Check out this song: ${selectedSong.title}`);
    const body = encodeURIComponent(`I found this song you might like: ${songLink}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleDownload = (audioDownloadUrl) => {
    saveAs(audioDownloadUrl, `music_${Date.now()}.mp3`); // Replace 'song.mp3' with the desired filename
  };

  if (loading) {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.loader}>
        <Typography variant="h6" color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {exploreMusic.map((album) =>
          album.song_items.map((song) => (
            <Grid item xs={12} sm={6} md={3} key={song.id}>
              <Card 
                className={`${classes.card} ${playingSongId === song.id ? classes.highlightedCard : ''}`} 
                onClick={() => handleCardClick(song.id)}
              >
                <CardMedia
                  className={classes.media}
                  image={`${BACKEND_HOST}${song.cover_img}` || 'placeholder.jpg'}
                  title={song.visual_desc}
                />
                <CardContent className={classes.content}>
                  <Typography variant="h6">{song.variation.substring(0, 100) + '..'}</Typography>
                  {song.lyrics && (
                    <Typography variant="body2" color="textSecondary">
                      {song.lyrics.substring(0, 50)}...
                    </Typography>
                  )}
                </CardContent>

                <div className={classes.songCard} onClick={(e) => e.stopPropagation()}>
                  <div className={classes.songInfo}>
                    {/* Optional: Add additional song info here */}
                  </div>
                  <IconButton
                    className={classes.playButton}
                    onClick={() => handlePlay(song, album)}
                  >
                    {playingSongId === song.id ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <IconButton 
                    className={classes.downloadButton} 
                    onClick={() => handleDownload(song.audio_download_url)}
                    download
                  >
                    <GetAppIcon />
                  </IconButton>
                  <IconButton 
                    className={classes.shareButton} // Apply the style here

                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleShare(song); 
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </div>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      

      <Dialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        aria-labelledby="share-dialog-title"
        maxWidth="md" // Set maxWidth to medium
         // Make the dialog responsive
      >
        <DialogTitle id="share-dialog-title"><h4>{selectedSong ? selectedSong.title : 'Share Song'}</h4></DialogTitle>
        <DialogContent>
          <Typography>Copy the link or share on social media:</Typography>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Button
              startIcon={<FileCopyIcon />}
              onClick={copyLinkToClipboard}
              color="primary"
            >
              Copy Link
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <IconButton onClick={handleShareToFacebook}>
              <img src={FacebookImg} alt="Facebook" className={classes.socialMediaIcon} />
            </IconButton>
            <IconButton onClick={handleShareToTwitter}>
              <img src={XTwitterImg} alt="Twitter" className={classes.socialMediaIcon} />
            </IconButton>
            <IconButton onClick={handleShareToWhatsapp}>
              <img src={WhatsappImg} alt="Whatsapp" className={classes.socialMediaIcon} />
            </IconButton>
            <IconButton onClick={handleShareToEmail}>
        <img src={MailImg} alt="Email" className={classes.socialMediaIcon} />
      </IconButton>
          </div>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={handleCloseShareDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


    </div>
  );
};

export default ExploreMusicPage;
