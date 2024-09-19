import React, { useEffect } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import { gridSpacing } from '../../store/constant';
import MusicItemCard from '../../ui-component/cards/MusicItemCard';
import { fetchMusicData } from '../../store/musicActions'; // Import your action

const Dashboard = () => {
    const dispatch = useDispatch();

    // Get music data, loading, and error states from the Redux store
    const { music = [], loading, error } = useSelector((state) => state.music || {});

    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates if the component is unmounted

        // Dispatch the action to fetch songs
        if (isMounted) {
            dispatch(fetchMusicData());
        }

        return () => {
            isMounted = false; // Cleanup to prevent any updates after unmount
        };
    }, [dispatch]);

    // If data is still loading, display a loading message
    if (loading) {
        return <Typography variant="h4">Loading...</Typography>;
    }

    // If there is an error, display an error message
    if (error) {
        return <Typography variant="h4" color="error">{error}</Typography>;
    }

    return (
        <>
            <Grid container spacing={gridSpacing}>
                {music.map((m, index) => (
                    <Grid key={index} item xs={12} my={2}>
                        <Box my={2}>
                            <Typography className='p-0 m-0' variant="h2" gutterBottom>
                                {m.title}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                <i>Generated: {m.created_date}</i>
                            </Typography>
                        </Box>

                        <Grid container spacing={gridSpacing}>
                            {m.song_items.map((songItem) => (
                                <Grid key={songItem.id} item lg={4} md={4} sm={4} xs={12}>
                                    <MusicItemCard   item={{songItem,title:m.title}} /> {/* Passing each song item */}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default Dashboard;
