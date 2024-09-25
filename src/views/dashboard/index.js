import React ,{useEffect, useState} from 'react';
import {Box, Grid, Typography} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';


import {gridSpacing} from '../../store/constant';
import MusicItemCard from '../../ui-component/cards/MusicItemCard';
import TotalChartCard from '../../ui-component/cards/TotalChartCard';
import TotalIncomePatternCard from '../../ui-component/cards/TotalIncomePatternCard';
import TotalIncomeCard from '../../ui-component/cards/TotalIncomeCard';
import ChartCard from '../../ui-component/cards/ChartCard';
import PopularCard from '../../ui-component/cards/PopularCard';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { GenerateAudio, GenerateImage } from '../../api';




const Dashboard = () => {

    const muiTheme = createMuiTheme({});
 

    const [music, setmusic] = useState([
        {img:'https://api.riffusion.com/storage/v1/object/public/images/private/e8e62e0a-5a3a-4998-bf4d-93bc1bbb8c5a.jpg'},
        {img:'https://api.riffusion.com/storage/v1/object/public/images/private/450d6535-7c3f-429f-ba22-1ec3d5e360a8.jpg'},
        {img:'https://api.riffusion.com/storage/v1/object/public/images/private/1c4887f6-12a7-4274-958a-babafe79eadb.jpg'},
        {img:'https://api.riffusion.com/storage/v1/object/public/images/private/45e77d25-03c6-4a5f-b7a3-f318de656d11.jpg'},
        {img:'https://api.riffusion.com/storage/v1/object/public/images/private/12142022-22d2-4e85-bc4e-da38e090b1c1.jpg'}
    ])

    // useEffect(() => {
    //     GenerateImage()
    // }, [])
    

    return (
        <>
        <Grid container spacing={gridSpacing}>

            <Grid my={2} item xs={12}>

            <Box my={2}>
            <Typography className='p-0 m-0'  variant="h2" gutterBottom>
                Timeless Dreams Smiles
            </Typography>

            <Typography variant="h6" gutterBottom>
               <i>Generated : Sat, Jun 8, 2024 10:40 PM</i>
            </Typography>
            </Box>

                <Grid container spacing={gridSpacing}>
                    {music.map((m,index) => (
                    <Grid key={index} item lg={4} md={6} sm={6} xs={12}>
                        <MusicItemCard item={m} />
                    </Grid>
                    ))}
                   
                </Grid>
            </Grid>


            <Grid my={2} item xs={12}>

                
            <Box my={2}>
            <Typography className='p-0 m-0'  variant="h2" gutterBottom>
                Timeless Dreams Smiles
            </Typography>

            <Typography variant="h6" gutterBottom>
               <i>Generated : Sat, Jun 8, 2024 10:40 PM</i>
            </Typography>
            </Box>

                <Grid container spacing={gridSpacing}>
                    {music.map((m,index) => (
                    <Grid key={index} item lg={4} md={6} sm={6} xs={12}>
                        <MusicItemCard item={m} />
                    </Grid>
                    ))}
                   
                </Grid>
            </Grid>
      

        </Grid>

      
        </>
    );
};

export default Dashboard;

