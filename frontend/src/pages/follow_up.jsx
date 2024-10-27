import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTTS } from '@cartesia/cartesia-js/react';
import { Button, Typography, Box, Container, IconButton, createTheme, ThemeProvider } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';

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

export default function FollowUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scenario, text: incomingText } = location.state || {}; 


  const aiResponse = incomingText || 'No AI response available.';

  const [currentText, setCurrentText] = useState(aiResponse); 
  const [isPlaying, setIsPlaying] = useState(false);

  const tts = useTTS({
    apiKey = process.env.CARTESIA_API_KEY,
    sampleRate: 22050,
  });

  useEffect(() => {
    console.log("Scenario:", scenario);
    console.log("AI Response:", aiResponse);
  }, [scenario, aiResponse]);

  const handlePlayPause = async () => {
    if (!currentText) { 
      console.error('No text provided for TTS playback.');
      return;
    }

    try {
      if (tts.playbackStatus === 'playing') {
        await tts.pause();
        setIsPlaying(false);
      } else {
        if (tts.bufferStatus !== 'buffered') {
          await tts.buffer({
            model_id: 'sonic-english',
            voice: {
              mode: 'id',
              id: 'a0e99841-438c-4a64-b679-ae501e7d6091',
            },
            transcript: currentText, //
          });
        }
        await tts.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing TTS:', error);
    }
  };

  const handleProceed = () => {
    navigate('/final_reply', { state: { response: currentText } }); 
  };

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
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
            Caller Follow-Up
          </Typography>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 3, mb: 3 }}>
            <Typography variant="body1" align="center" paragraph>
              {aiResponse}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" mb={4}>
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
              {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
            </IconButton>
          </Box>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleProceed}
              sx={{
                bgcolor: '#ff4081',
                color: 'white',
                '&:hover': { bgcolor: '#f50057' },
                py: 2,
                px: 4,
                borderRadius: 50,
              }}
            >
              Continue
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
