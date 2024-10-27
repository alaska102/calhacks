import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Container, Card, CardContent, Box, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f44336', 
    },
    secondary: {
      main: '#3f51b5', 
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default function Insights() {
  const location = useLocation();
  const { insights } = location.state || {};

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(45deg, #f44336 30%, #3f51b5 90%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h3" align="center" gutterBottom sx={{ color: '#ff4081' }}>
                Conversation Insights
              </Typography>
              {insights ? (
                <>
                  <Typography variant="h5" gutterBottom>
                    Detailed Insights
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
                    {insights}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" align="center">
                  Insights data is missing. Please restart the process.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
