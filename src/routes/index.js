import React, { Suspense, useEffect } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/actions';
import Loader from '../ui-component/extended/Loader/Loader';
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';

const Routes = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const userCookie = Cookies.get('music_ai_user');
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            console.log("User data from cookie:", userData); // Check what user data is retrieved
            dispatch(setUser(userData));
        }
    }, [dispatch]);

    // Check if user state is still being determined
    if (user === undefined) {
        return <Loader />;
    }

    console.log("Current user state:", user); // Log current user state



    return (
        <AnimatePresence>
            <Suspense fallback={<Loader />}>
                <Switch>
                    {/* Public Routes */}
                    
                    {user ==null &&  <Route path="/login" component={AuthenticationRoutes} /> }

                    {/* Protected Routes */}
                    {user ? (
                        <>
                            <MainRoutes />
                            {/* <Redirect exact from="/" to="/dashboard" /> */}
                        </>
                    ) : (
                        <>
                        <Route path="/login" component={AuthenticationRoutes} />
                        <Route path="/register" component={AuthenticationRoutes} /> 
                        {/* <Redirect exact to="/login" /> */}
                        </>
                    )}

                </Switch>
            </Suspense>
        </AnimatePresence>
    );
};

export default Routes;
