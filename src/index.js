import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import App from './App';
import reducer from './store/reducer';
import config from './config';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './assets/scss/style.scss';
import * as serviceWorker from './serviceWorker';
import toast, { Toaster } from 'react-hot-toast';


const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
     <Toaster position="bottom-center"
  reverseOrder={false} />
        <BrowserRouter basename={config.basename}>
        <GoogleOAuthProvider clientId="166719880647-dtqtf61pf4sb46gds3hrdcjqd3016lcm.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
        </BrowserRouter>
        
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
