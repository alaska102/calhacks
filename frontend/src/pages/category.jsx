import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTTS } from '@cartesia/cartesia-js/react';
import { 
  Button, 
  Typography, 
  Box,
  Container,
  IconButton,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { PlayArrow, Pause, Mic } from '@mui/icons-material';


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

export default function Category() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, scenario } = location.state || {};
  const [text, setText] = useState(scenario || '');

  const tts = useTTS({
    apiKey = process.env.CARTESIA_API_KEY,
    sampleRate: 22050,
  });

  useEffect(() => {
    if (scenario) {
      setText(scenario);
    }
  }, [scenario]);

  const handlePlayPause = async () => {
    if (!text) {
      console.error('No text provided for TTS playback.');
      return;
    }

    if (tts.playbackStatus === 'playing') {
      await tts.pause();
    } else {
      try {
        if (tts.bufferStatus !== 'buffered') {
          await tts.buffer({
            model_id: 'sonic-english',
            voice: {
              mode: 'id',
              id: 'a0e99841-438c-4a64-b679-ae501e7d6091',
            },
            transcript: text,
            options: {
              temperature: 0.3,
              top_p: 0.8,
              top_k: 20,
            },
          });
        }
        await tts.play();
      } catch (error) {
        console.error('Error playing TTS:', error);
      }
    }
  };

  const handleProceedToResponse = () => {
    navigate('/response', { state: { category, scenario } });
  };

  if (!category || !scenario) {
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
          }}
        >
          <Typography variant="body1" align="center">
            No category or scenario provided. Please go back and select a category.
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

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
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h2" component="h1" align="center" gutterBottom>
            <Box component="span" sx={{ color: 'rgba(255,255,255,0.8)' }}>crisis call</Box>{' '}
            <Box component="span" sx={{ color: '#ff4081' }}>simulation</Box>
          </Typography>
          <Typography variant="h4" align="center" color="white" gutterBottom>
            {category}
          </Typography>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 3, mb: 3 }}>
            <Typography variant="body1" align="center" paragraph>
              {scenario}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" mb={2}>
            <IconButton 
              onClick={handlePlayPause} 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              {tts.playbackStatus === 'playing' ? (
                <Pause fontSize="large" />
              ) : (
                <PlayArrow fontSize="large" />
              )}
            </IconButton>
          </Box>
          <Typography variant="caption" display="block" align="center" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Playback Status: {tts.playbackStatus}
          </Typography>
          <Typography variant="caption" display="block" align="center" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Buffer Status: {tts.bufferStatus}
          </Typography>
          <Box display="flex" justifyContent="center" mt={3}>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<Mic />} 
              onClick={handleProceedToResponse}
              sx={{
                bgcolor: '#ff4081',
                color: 'white',
                '&:hover': { bgcolor: '#f50057' },
                py: 1,
                px: 4,
                borderRadius: 50,
              }}
            >
              Respond
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}