import { SHOW_MUSIC_PLAYER, HIDE_MUSIC_PLAYER } from './actions';

const initialState = {
  isVisible: false,
};

const musicPlayerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MUSIC_PLAYER:
      return {
        ...state,
        isVisible: true,
      };
    case HIDE_MUSIC_PLAYER:
      return {
        ...state,
        isVisible: false,
      };
    default:
      return state;
  }
};

export default musicPlayerReducer;
