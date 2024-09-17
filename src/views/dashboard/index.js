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
import { GenerateAudio } from '../../api';




const Dashboard = () => {

    const muiTheme = createMuiTheme({});
 

    const [music, setmusic] = useState([
        {
            title: 'Timeless Dreams Smiles',
            created_date : 'Generated : Sat, Jun 8, 2024 10:40 PM',
            songs:[
                {
                    img:'https://api.riffusion.com/storage/v1/object/public/images/private/e8e62e0a-5a3a-4998-bf4d-93bc1bbb8c5a.jpg',
                    audio_url : 'https://cdn1.suno.ai/0c0e3863-48b2-4bd9-8db0-79a2bda59e51.mp3',
                    description:'used to demonstrate the visual form of a document or a typeface without relying on meaningful content.'
                },
                {
                    img:'https://api.riffusion.com/storage/v1/object/public/images/private/e8e62e0a-5a3a-4998-bf4d-93bc1bbb8c5a.jpg',
                    audio_url : 'https://cdn1.suno.ai/0c0e3863-48b2-4bd9-8db0-79a2bda59e51.mp3',
                    description:'used to demonstrate the visual form of a document or a typeface without relying on meaningful content.'
                }
            ]
            
        }
    ])


    

    return (
        <>
        <Grid container spacing={gridSpacing}>

        {music.map((m,index) => (
            <Grid key={index} my={2} item xs={12}>

            <Box my={2}>
            <Typography className='p-0 m-0'  variant="h2" gutterBottom>
                {m.title}
            </Typography>

            <Typography variant="h6" gutterBottom>
               <i>Generated : {m.created_date}</i>
            </Typography>
            </Box>

                <Grid container spacing={gridSpacing}>
                    {m.songs.map((song,index) => (
                    <Grid key={index} item lg={6} md={6} sm={6} xs={12}>
                        <MusicItemCard item={song} />
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

