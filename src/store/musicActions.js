import { FETCH_MUSIC_REQUEST, FETCH_MUSIC_SUCCESS, FETCH_MUSIC_FAILURE } from './types';
import { GetSongsByUserEmail } from '../api'; // Adjust import if necessary

export const fetchMusicData = () => async (dispatch) => {
    dispatch({ type: FETCH_MUSIC_REQUEST });

    try {
        const result = await GetSongsByUserEmail();
        console.log(result)
        dispatch({
            type: FETCH_MUSIC_SUCCESS,
            payload: result.responseData, // Adjust based on your API response structure
        });
    } catch (error) {
        dispatch({
            type: FETCH_MUSIC_FAILURE,
            payload: error.message,
        });
    }
};
