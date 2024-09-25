// exploreMusicReducer.js
import { 
    FETCH_EXPLORE_MUSIC_REQUEST, 
    FETCH_EXPLORE_MUSIC_SUCCESS, 
    FETCH_EXPLORE_MUSIC_FAILURE, 
    ADD_EXPLORE_SONG, 
    SHOW_EXPLORE_MUSIC_PLAYER, 
    HIDE_EXPLORE_MUSIC_PLAYER, 
    SET_LOADING_EXPLORE_SONG_GENERATION 
} from './types';

const initialState = {
    exploreMusic: [],
    loading: false,
    error: null,
    isVisible: false,
    currentSong: null,
    loadingSongGeneration: false,
};

const exploreMusicReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_EXPLORE_MUSIC_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_EXPLORE_MUSIC_SUCCESS:
            return {
                ...state,
                exploreMusic: action.payload,
                loading: false,
                error: null,
            };
        case FETCH_EXPLORE_MUSIC_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case ADD_EXPLORE_SONG:
            return {
                ...state,
                exploreMusic: [action.payload, ...state.exploreMusic],
            };
        case SHOW_EXPLORE_MUSIC_PLAYER:
            return {
                ...state,
                isVisible: true,
                currentSong: action.payload,
            };
        case HIDE_EXPLORE_MUSIC_PLAYER:
            return {
                ...state,
                isVisible: false,
                currentSong: null,
            };
        case SET_LOADING_EXPLORE_SONG_GENERATION:
            return {
                ...state,
                loadingSongGeneration: action.payload,
            };
        default:
            return state;
    }
};

export default exploreMusicReducer;
