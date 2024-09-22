import React from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent } from '@material-ui/core';
import './styles.css';

const App = () => {
  const genres = [
    'Pop', 'Hip-hop', 'Jazz', 'Rock', 'EDM', 'Indie', 'R&B', 'Classical', 'Chill', 'Afrobeat'
  ];

  const trendingTracks = [
    { title: 'Blinding Lights', artist: 'The Weeknd' },
    { title: 'Levitating', artist: 'Dua Lipa' },
    { title: 'Watermelon Sugar', artist: 'Harry Styles' },
    { title: 'Peaches', artist: 'Justin Bieber' },
  ];

  return (
    <div className="app-container">
   
      <Container>
        <main>
          {/* Featured Genres */}
          <section className="genres-section">
            <Typography variant="h4" gutterBottom>Featured Genres</Typography>
            <Grid container spacing={2}>
              {genres.map((genre, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card className="genre-card">
                    <CardContent>
                      <Typography variant="h5">{genre}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </section>

          {/* Trending Tracks */}
          <section className="trending-section">
            <Typography variant="h4" gutterBottom>Trending Tracks</Typography>
            <Grid container spacing={2}>
              {trendingTracks.map((track, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card className="track-card">
                    <CardContent>
                      <Typography variant="h6">{track.title}</Typography>
                      <Typography variant="body2" color="textSecondary">{track.artist}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </section>

          {/* Explore Circular Genres */}
          <section className="circular-genres-section">
            <Typography variant="h4" gutterBottom>Explore by Genre</Typography>
            <div className="circular-genres">
              {genres.map((genre, index) => (
                <div className={`circular-item circular-item-${index}`} key={index}>
                  {genre}
                </div>
              ))}
            </div>
          </section>
        </main>
      </Container>
    </div>
  );
};

export default App;
