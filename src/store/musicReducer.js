import { FETCH_MUSIC_SUCCESS, FETCH_MUSIC_FAILURE, FETCH_MUSIC_REQUEST, ADD_SONG } from './types';

const initialState = {
    music: [], // Store songs here
    loading: false,
    error: null
};

// Reducer function
const musicReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MUSIC_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_MUSIC_SUCCESS:
            return {
                ...state,
                music: action.payload,
                loading: false,
                error: null
            };
        case FETCH_MUSIC_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case ADD_SONG:
            return {
                ...state,
                music: [ action.payload, ...state.music], // Append the new song to the music array
            };
        default:
            return state;
    }
};

export default musicReducer;
