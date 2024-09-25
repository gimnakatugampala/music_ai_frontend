import React, { Suspense, useEffect, useState } from 'react';
import { Redirect, Switch, Route, useLocation } from 'react-router-dom';
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
    const location = useLocation(); // Get current location
    const [loading, setLoading] = useState(true); // Loading state to manage initial loading

    // Fetch user data from cookies and set it in the redux store
    useEffect(() => {
        const userCookie = Cookies.get('music_ai_user');
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            console.log("User data from cookie:", userData); // Check what user data is retrieved
            dispatch(setUser(userData));
        }
        // Set loading to false once user data is retrieved
        setLoading(false);
    }, [dispatch]);

    // Redirect to login if user is null and trying to access a protected route
    useEffect(() => {
        if (!loading && !user && location.pathname !== '/login' && location.pathname !== '/register') {
            window.location.href = "/login";
        }
    }, [user, location.pathname, loading]);

    // Display loader while checking user state
    if (loading) {
        return <Loader />;
    }

    console.log("Current user state:", user); // Log current user state

    return (
        <AnimatePresence>
            <Suspense fallback={<Loader />}>
                <Switch>
                    {/* Public Routes */}
                    <Route path="/login" component={AuthenticationRoutes} />
                    <Route path="/register" component={AuthenticationRoutes} />

                    {/* Protected Routes */}
                    {user ? (
                        <>
                            <MainRoutes />
                        </>
                    ) : (
                        <>
                            <Redirect exact to="/login" />
                        </>
                    )}
                </Switch>
            </Suspense>
        </AnimatePresence>
    );
};

export default Routes;
