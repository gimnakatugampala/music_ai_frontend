import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

// Utility to check if user is authenticated
const isAuthenticated = () => {
    const userCookie = Cookies.get('music_ai_user');
    return !!userCookie; // Returns true if the user cookie exists
};

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect to="/login" />
            )
        }
    />
);

export default PrivateRoute;
