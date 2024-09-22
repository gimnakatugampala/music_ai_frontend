import React, { lazy } from 'react';
import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import MainLayout from './../layout/MainLayout';

const DashboardDefault = lazy(() => import('../views/dashboard/index'));
const ExplorePage = lazy(() => import('../views/explore/index'));
const SearchPage = lazy(() => import('../views/search/index'));
const SongsPage = lazy(() => import('../views/songs/index'));

const MainRoutes = () => {
    const location = useLocation();

    return (
        <MainLayout showBreadcrumb={true}>
            <Switch location={location} key={location.pathname}>
                <Route path="/dashboard" component={DashboardDefault} />
                <Route path="/explore" component={ExplorePage} />
                <Route path="/search" component={SearchPage} />
                <Route path="/songs" component={SongsPage} />
                {/* Add a catch-all route if necessary */}
                {/* <Redirect to="/login" />  */}
            </Switch>
        </MainLayout>
    );
};

export default MainRoutes;
