import { FETCH_MUSIC_REQUEST, FETCH_MUSIC_SUCCESS, FETCH_MUSIC_FAILURE, ADD_SONG , SET_LOADING_SONG_GENERATION } from './types';
import { GetSongsByUserEmail } from '../api'; // Adjust import if necessary

// Fetch music data (existing code)
export const fetchMusicData = () => async (dispatch) => {
    dispatch({ type: FETCH_MUSIC_REQUEST });

    try {
        const result = await GetSongsByUserEmail();
        console.log(result);
        dispatch({
            type: FETCH_MUSIC_SUCCESS,
            payload: result.responseData.reverse(), // Adjust based on your API response structure
        });
    } catch (error) {
        dispatch({
            type: FETCH_MUSIC_FAILURE,
            payload: error.message,
        });
    }
};

// Action creator to add a new song
export const addSong = (newSong) => {
    return {
        type: ADD_SONG,
        payload: newSong,
    };
};


// Action creator to set loading state for song generation
export const setLoadingSongGeneration = (isLoading) => {
    return {
        type: SET_LOADING_SONG_GENERATION,
        payload: isLoading,
    };
};