import React, {lazy} from 'react';
import {Route, Switch, useLocation} from 'react-router-dom';
import MinimalLayout from './../layout/MinimalLayout';

// login option 3
const AuthLogin3 = lazy(() => import('../views/pages/authentication/authentication3/Login3'));
const AuthRegister3 = lazy(() => import('../views/pages/authentication/authentication3/Register3'));


const AuthenticationRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/login',
                '/register'
            ]}
        >
            <MinimalLayout>
                <Switch location={location} key={location.pathname}>

                    <Route path="/login" component={AuthLogin3} />
                    <Route path="/register" component={AuthRegister3} />

                </Switch>
            </MinimalLayout>
        </Route>
    );
};

export default AuthenticationRoutes;
