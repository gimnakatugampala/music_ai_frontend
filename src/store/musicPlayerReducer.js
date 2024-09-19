import { SHOW_MUSIC_PLAYER, HIDE_MUSIC_PLAYER } from './actions';

const initialState = {
    isVisible: false,
    currentSong: null,
};

const musicPlayerReducer = (state = initialState, action) => {
    switch (action.type) {
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
        default:
            return state;
    }
};

export default musicPlayerReducer;
