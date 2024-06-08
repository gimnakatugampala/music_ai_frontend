import {combineReducers} from 'redux';
import customizationReducer from './customizationReducer';
import snackbarReducer from './snackbarReducer';
import musicPlayerReducer from './musicPlayerReducer '

const reducer = combineReducers({
    customization: customizationReducer,
    snackbar: snackbarReducer,
    musicPlayer:musicPlayerReducer
});

export default reducer;
