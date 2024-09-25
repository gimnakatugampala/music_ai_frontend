import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import MinimalLayout from './../layout/MinimalLayout';

const AuthLogin3 = lazy(() => import('../views/pages/authentication/authentication3/Login3'));
const AuthRegister3 = lazy(() => import('../views/pages/authentication/authentication3/Register3'));

const AuthenticationRoutes = () => {
    const location = useLocation();

    return (
        <MinimalLayout>
            <Switch location={location} key={location.pathname}>
                <Route path="/login" component={AuthLogin3} />
                <Route path="/register" component={AuthRegister3} />
            </Switch>
        </MinimalLayout>
    );
};

export default AuthenticationRoutes;
