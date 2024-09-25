// exploreMusicActions.js
import { 
    FETCH_EXPLORE_MUSIC_REQUEST, 
    FETCH_EXPLORE_MUSIC_SUCCESS, 
    FETCH_EXPLORE_MUSIC_FAILURE, 
    ADD_EXPLORE_SONG, 
    SET_LOADING_EXPLORE_SONG_GENERATION 
} from './types';
import { GetExploreSongs } from '../api'; // Adjust import based on your project structure

export const fetchExploreMusicData = () => async (dispatch) => {
    dispatch({ type: FETCH_EXPLORE_MUSIC_REQUEST });

    try {
        const result = await GetExploreSongs(); // Fetching the explore music data
        dispatch({
            type: FETCH_EXPLORE_MUSIC_SUCCESS,
            payload: result.responseData, // Reverse if needed based on your API response
        });
    } catch (error) {
        dispatch({
            type: FETCH_EXPLORE_MUSIC_FAILURE,
            payload: error.message,
        });
    }
};

export const addExploreSong = (newSong) => {
    return {
        type: ADD_EXPLORE_SONG,
        payload: newSong,
    };
};

export const setLoadingExploreSongGeneration = (isLoading) => {
    return {
        type: SET_LOADING_EXPLORE_SONG_GENERATION,
        payload: isLoading,
    };
};

export const showExploreMusicPlayer = (song) => {
    return {
        type: 'SHOW_EXPLORE_MUSIC_PLAYER',
        payload: song,
    };
};

export const hideExploreMusicPlayer = () => {
    return {
        type: 'HIDE_EXPLORE_MUSIC_PLAYER',
    };
};
