import React, { useEffect } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { gridSpacing } from '../../store/constant';
import MusicItemCard from '../../ui-component/cards/MusicItemCard';
import { fetchMusicData } from '../../store/musicActions'; // Import your action
import CalculateDateTime from '../../functions/CalculateDateTime';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { music = [], loading, error , loadingSongGeneration  } = useSelector((state) => state.music || {});

    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates if the component is unmounted
        if (isMounted) {
            dispatch(fetchMusicData());
        }
        return () => {
            isMounted = false; // Cleanup to prevent any updates after unmount
        };
    }, [dispatch]);

    // If data is still loading, display a loading message
    if (loading) {
        return (
            <Grid container spacing={gridSpacing}>
                {Array.from({ length: 3 }).map((_, index) => ( // Adjust the length as needed
                    <Grid key={index} item xs={12} my={2}>
                        <Box my={2}>
                            <Skeleton width={700} height={40} style={{ marginBottom: '10px' }} /> {/* Title Skeleton */}
                            <Skeleton width={300} height={30} style={{ marginBottom: '20px' }} /> {/* Date Skeleton */}
                        </Box>
                        <Grid container spacing={gridSpacing}>
                            {Array.from({ length: 2 }).map((_, songIndex) => ( // Placeholder for song items
                                <Grid key={songIndex} item lg={4} md={4} sm={4} xs={12}>
                                    <Skeleton style={{borderRadius:'5%'}} height={250} /> {/* Skeleton for MusicItemCard */}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        );
    }

    // If there is an error, display an error message
    if (error) {
        return <Typography variant="h4" color="error">{error}</Typography>;
    }

    return (
        <Grid container spacing={gridSpacing}>


            {/* Temp Save Loading */}
            {loadingSongGeneration && (
            <Grid  item xs={12} my={2}>
                        <Box my={2}>
                            <Skeleton width={700} height={40} style={{ marginBottom: '10px' }} /> {/* Title Skeleton */}
                            <Skeleton width={300} height={30} style={{ marginBottom: '20px' }} /> {/* Date Skeleton */}
                        </Box>
                        <Grid container spacing={gridSpacing}>
                            {Array.from({ length: 2 }).map((_, songIndex) => ( // Placeholder for song items
                                <Grid key={songIndex} item lg={4} md={4} sm={4} xs={12}>
                                    <Skeleton style={{borderRadius:'5%'}} height={250} /> {/* Skeleton for MusicItemCard */}
                                </Grid>
                            ))}
                        </Grid>
            </Grid>
            )}

            {music.length > 0 ? music.map((m, index) => (
                <Grid key={index} item xs={12} my={2}>
                    <Box my={2}>
                        <Typography className='p-0 m-0' variant="h2" gutterBottom>
                            {m.title}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            <i>Generated: {CalculateDateTime(m.created_date)}</i>
                        </Typography>
                    </Box>
                    <Grid  container spacing={gridSpacing}>
                        {m.song_items.map((songItem,index) => (
                            <Grid  key={songItem.id}  item lg={4} md={4} sm={4} xs={12}>
                                <MusicItemCard item={{ songItem, title: m.title, created_date: m.created_date }} /> {/* Passing each song item */}
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )) : <Skeleton count={5} /> }
        </Grid>
    );
};

export default Dashboard;
