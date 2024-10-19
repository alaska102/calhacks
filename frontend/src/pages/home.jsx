import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import { 
  Button, 
  Typography, 
  Container, 
  Box 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#81A4CD',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

// Array of topics to cycle through
const topics = [
  'Substance Abuse',
  'Domestic Violence',
  'Eating Disorders',
  'Sexual Harassment',
  'Suicide Prevention',
  'Sexual Abuse',
  'Gambling Addiction'
];

export default function Home() {
  const navigate = useNavigate(); // Hook for navigation

  const handleStartPractice = () => {
    navigate('/practice'); // Navigate to the practice page
  };

  // State to keep track of the current topic index
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);

  // useEffect to cycle through topics at set intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopicIndex(prevIndex => (prevIndex + 1) % topics.length);
    }, 3000); // Change topic every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NavigationBar />
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box textAlign="center">
          <Typography variant="h1" component="h1" gutterBottom>
            <Box component="span" color="text.secondary" fontWeight='bold'>crisis call </Box>
            <Box component="span" color="secondary.main">simulation</Box>
          </Typography>
          
          <Typography variant="h5" color="text.secondary" paragraph>
            Helping you feel more confident in crisis situations. Focusing on topics like:
          <br />
          </Typography>
          <Typography variant="h5" color="primary.main"   sx={{
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              display: 'inline-block',
              padding: '2px 4px',
              borderRadius: '5px',
              mb: 4
            }}
            >
            {topics[currentTopicIndex]}
          </Typography>          
          <br />

          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleStartPractice}
            sx={{ mt: 4, mb: 6, py: 2, px: 6, borderRadius: 50, color: 'white', minWidth: '280px', fontSize: '1.5rem', fontWeight: 'light' }}
          >
            Start Simulation
          </Button>

          <Box mt={6}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              How it works:
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose a hotline category, respond to simulated calls, and receive feedback on your performance. Improve your skills with each session.
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
