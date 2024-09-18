import { SHOW_MUSIC_PLAYER, HIDE_MUSIC_PLAYER } from './actions';

// Initial state of the music player
const initialState = {
  isVisible: false,  // Determines if the music player is visible or hidden
};

// Music player reducer function
const musicPlayerReducer = (state = initialState, action) => {
  switch (action.type) {
    // Action to show the music player
    case SHOW_MUSIC_PLAYER:
      return {
        ...state,
        isVisible: true,  // Set visibility to true
      };
      
    // Action to hide the music player
    case HIDE_MUSIC_PLAYER:
      return {
        ...state,
        isVisible: false,  // Set visibility to false
      };
      
    // Return the current state by default
    default:
      return state;
  }
};

export default musicPlayerReducer;
