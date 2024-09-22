import React, { useEffect, useState } from 'react';
import { TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, CircularProgress, Typography } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import DownloadIcon from '@material-ui/icons/GetApp'; // Import Download icon
import ShareIcon from '@material-ui/icons/Share'; // Import Share icon
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BACKEND_HOST, GetAllSongs } from '../../api';
import { showMusicPlayer } from '../../store/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  searchField: {
    marginBottom: theme.spacing(2),
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  list: {
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s, box-shadow 0.2s',
    '&:hover': {
      backgroundColor: '#e0e0e0',
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
  },
  playingItem: {
    backgroundColor: '#d0f0c0',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  coverImage: {
    width: 50,
    height: 50,
  },
  title: {
    fontWeight: 'bold',
  },
  variation: {
    color: theme.palette.text.secondary,
  },
  playButton: {
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  actionButton: {
    marginLeft: theme.spacing(1), // Space between icons
  },
}));

const SearchPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [playingSongId, setPlayingSongId] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await GetAllSongs();
        console.log(data);
        setSongs(data.responseData || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    const flattenedSongs = songs.flatMap(song => 
      song.song_items.map(item => ({
        ...item,
        title: song.title,
        created_date: song.created_date,
      }))
    );

    setFilteredSongs(
      flattenedSongs.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, songs]);

  const handlePlay = (song) => {
    const item = {
      created_date: song.created_date,
      title: song.title,
      songItem: song,
    };
    dispatch(showMusicPlayer(item));
    setPlayingSongId(song.id);
  };

  const handleItemClick = (code) => {
    history.push(`/songs?code=${code}`);
  };

  const handleDownload = (song) => {
    // Implement download logic here
    console.log(`Downloading: ${song.title}`);
  };

  const handleShare = (song) => {
    // Implement share logic here
    console.log(`Sharing: ${song.title}`);
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
      <TextField
        className={classes.searchField}
        variant="outlined"
        placeholder="Search for songs..."
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <List className={classes.list}>
        {filteredSongs.map((song) => (
          <ListItem 
            className={`${classes.listItem} ${playingSongId === song.id ? classes.playingItem : ''}`} 
            key={song.id} 
            onClick={() => handleItemClick(song.id)} 
          >
            <ListItemAvatar>
              <Avatar 
                alt={song.title} 
                src={`${BACKEND_HOST}${song.cover_img}`} 
                className={classes.coverImage} 
              />
            </ListItemAvatar>
            <ListItemText 
              primary={<Typography className={classes.title}>{song.title}</Typography>} 
              secondary={<Typography className={classes.variation}>{song.variation}</Typography>} 
            />
            <IconButton 
              className={classes.playButton} 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (playingSongId === song.id) {
                  setPlayingSongId(null);
                } else {
                  handlePlay(song);
                }
              }}
            >
              {playingSongId === song.id ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton 
              className={classes.actionButton} 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleDownload(song); 
              }}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton 
              className={classes.actionButton} 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleShare(song); 
              }}
            >
              <ShareIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SearchPage;
