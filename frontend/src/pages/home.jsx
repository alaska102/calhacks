import React, { useState, useEffect } from 'react';
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
      main: '#3f51b5',
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
  'Eating Disorder',
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
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box textAlign="center">
          <Typography variant="h2" component="h1" gutterBottom>
            <Box component="span" color="text.secondary">hotline</Box>
            <Box component="span" color="primary.main">warm</Box>
            <Box component="span" color="secondary.main">up</Box>
          </Typography>
          
          <Typography variant="h5" color="text.secondary" paragraph>
            A quick way to prepare for your next hotline shift in
          </Typography>
          <Typography variant="h5" color="primary.main" paragraph>
            {topics[currentTopicIndex]}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Practice key responses, gain insights into your answers, and become more comfortable handling sensitive situations.
          </Typography>

          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleStartPractice}
            sx={{ mt: 2, mb: 4, py: 1.5, px: 4, borderRadius: 28 }}
          >
            Start practicing
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
