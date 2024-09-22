import React, { lazy } from 'react';
import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import MainLayout from './../layout/MainLayout';

const DashboardDefault = lazy(() => import('../views/dashboard/index'));
const ExplorePage = lazy(() => import('../views/explore/index'));
const SearchPage = lazy(() => import('../views/search/index'));

const MainRoutes = () => {
    const location = useLocation();

    return (
        <MainLayout showBreadcrumb={true}>
            <Switch location={location} key={location.pathname}>
                <Route path="/dashboard" component={DashboardDefault} />
                <Route path="/explore" component={ExplorePage} />
                <Route path="/search" component={SearchPage} />
                {/* Add a catch-all route if necessary */}
                {/* <Redirect to="/dashboard" /> Fallback for unmatched routes */}
            </Switch>
        </MainLayout>
    );
};

export default MainRoutes;
