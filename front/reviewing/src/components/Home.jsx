import { Container, Typography } from '@mui/material';
import React from 'react';
import NaverMapComponent from './NaverMapComponent';

const Home = () => {
  return (
    <Container>
      <Typography variant='h1' align='center' gutterBottom>
        Welcome to the Home Page
      </Typography>
      <Typography variant='body1' align='center'>
        This is the homepage of the application.
      </Typography>
      <NaverMapComponent />
    </Container>
  );
};

export default Home;
