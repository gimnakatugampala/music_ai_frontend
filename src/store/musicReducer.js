import { FETCH_MUSIC_SUCCESS, FETCH_MUSIC_FAILURE, FETCH_MUSIC_REQUEST, ADD_SONG , SHOW_MUSIC_PLAYER, HIDE_MUSIC_PLAYER , SET_LOADING_SONG_GENERATION } from './types';

const initialState = {
    music: [],
    loading: false,
    error: null,
    isVisible: false,
    currentSong: null,
    loadingSongGeneration: false, // Add new state for song generation loading
};

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
                music: [action.payload, ...state.music],
            };
        case SHOW_MUSIC_PLAYER:
            return {
                ...state,
                isVisible: true,
                currentSong: action.payload,
            };
        case HIDE_MUSIC_PLAYER:
            return {
                ...state,
                isVisible: false,
                currentSong: null,
            };
        case SET_LOADING_SONG_GENERATION: // Handle loading state for song generation
        return {
            ...state,
            loadingSongGeneration: action.payload,
        };
        default:
            return state;
    }
};

export default musicReducer;