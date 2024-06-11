import {combineReducers} from 'redux';
import customizationReducer from './customizationReducer';
import snackbarReducer from './snackbarReducer';
import musicPlayerReducer from './musicPlayerReducer';
import UserReducer from './UserReducer';

const reducer = combineReducers({
    customization: customizationReducer,
    snackbar: snackbarReducer,
    musicPlayer:musicPlayerReducer,
    user:UserReducer
});

export default reducer;
