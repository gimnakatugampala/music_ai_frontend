import React, {Suspense, useEffect} from 'react';
import {Redirect, Switch} from 'react-router-dom';
import {AnimatePresence} from 'framer-motion';

import config from './../config';
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

import Loader from '../ui-component/extended/Loader/Loader';

import AuthenticationRoutes from './AuthenticationRoutes';
import Cookies from 'js-cookie';

import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/actions';


const Routes = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        // Check if the user is already logged in
        const userCookie = Cookies.get('music_ai_user');
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            dispatch(setUser(userData));
        }

    }, []);

    return (
        <AnimatePresence>
            <Suspense fallback={<Loader />}>
                <Switch>
                    <>
                        <AuthenticationRoutes />
                        <MainRoutes />

                        {user == null ? (

                            <Redirect exact  to="/login" />

                        ) : (

                            <Redirect exact  to="/dashboard" />

                        )}
                           
                    </>
                </Switch>
            </Suspense>
        </AnimatePresence>
    );
};

export default Routes;
