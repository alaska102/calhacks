import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTTS } from '@cartesia/cartesia-js/react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box,
  Container,
  IconButton
} from '@mui/material';
import { PlayArrow, Pause, Mic } from '@mui/icons-material';

export default function Category() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, scenario } = location.state || {};
  const [text, setText] = useState(scenario || '');

  const tts = useTTS({
    apiKey: '', // Make sure this environment variable is set correctly
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
    // Navigate to the next page for the user to respond
    navigate('/response', { state: { category, scenario } });
  };

  if (!category || !scenario) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Card>
          <CardContent>
            <Typography variant="body1" align="center">
              No category or scenario provided. Please go back and select a category.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
        <CardHeader 
          title={
            <Typography variant="h4" component="h2" align="center" color="primary">
              {category}
            </Typography>
          }
        />
        <CardContent>
          <Typography variant="body1" align="center" paragraph>
            {scenario}
          </Typography>
          <Box display="flex" justifyContent="center" mb={2}>
            <IconButton 
              onClick={handlePlayPause} 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main', 
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              {tts.playbackStatus === 'playing' ? (
                <Pause fontSize="large" />
              ) : (
                <PlayArrow fontSize="large" />
              )}
            </IconButton>
          </Box>
          <Typography variant="caption" display="block" align="center">
            Playback Status: {tts.playbackStatus}
          </Typography>
          <Typography variant="caption" display="block" align="center">
            Buffer Status: {tts.bufferStatus}
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<Mic />} 
              onClick={handleProceedToResponse}
            >
              Respond
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
