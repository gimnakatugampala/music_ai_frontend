import { FETCH_MUSIC_SUCCESS, FETCH_MUSIC_FAILURE, FETCH_MUSIC_REQUEST } from './types';

const initialState = {
    music: [],
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
        default:
            return state;
    }
};

export default musicReducer;
