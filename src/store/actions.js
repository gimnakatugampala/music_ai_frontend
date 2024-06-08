export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const ACCOUNT_INITIALISE = 'ACCOUNT_INITIALISE';
export const FIREBASE_STATE_CHANGED = 'FIREBASE_STATE_CHANGED';
export const SET_MENU = 'SET_MENU';

// Action for Combine Reducer
export const MENU_OPEN = '@customization/MENU_OPEN';
export const MENU_TYPE = '@customization/MENU_TYPE';
export const THEME_LOCALE = '@customization/THEME_LOCALE';
export const THEME_RTL = '@customization/THEME_RTL';
export const SET_FONT_FAMILY = '@customization/SET_FONT_FAMILY';
export const SET_BORDER_RADIUS = '@customization/SET_BORDER_RADIUS';

export const SNACKBAR_OPEN = '@snackbar/SNACKBAR_OPEN';


// Music PLayer
export const SHOW_MUSIC_PLAYER = 'SHOW_MUSIC_PLAYER';
export const HIDE_MUSIC_PLAYER = 'HIDE_MUSIC_PLAYER';

export const showMusicPlayer = () => ({
    type: SHOW_MUSIC_PLAYER,
  });
  
  export const hideMusicPlayer = () => ({
    type: HIDE_MUSIC_PLAYER,
  });