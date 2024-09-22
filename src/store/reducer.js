import {combineReducers} from 'redux';
import customizationReducer from './customizationReducer';
import snackbarReducer from './snackbarReducer';
import musicPlayerReducer from './musicPlayerReducer';
import UserReducer from './UserReducer';
import musicReducer from './musicReducer';
import exploreMusicReducer from './exploreMusicReducer';

const reducer = combineReducers({
    customization: customizationReducer,
    snackbar: snackbarReducer,
    musicPlayer:musicPlayerReducer,
    user:UserReducer,
    music:musicReducer,
    exploreMusic:exploreMusicReducer
});

export default reducer;
