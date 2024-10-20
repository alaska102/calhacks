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
import { PlayArrow, Pause } from '@mui/icons-material';

export default function FollowUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, scenario, response } = location.state || {};
  const [text, setText] = useState(response || '');
  const [isPlaying, setIsPlaying] = useState(false);

  const tts = useTTS({
    apiKey: '', // Make sure this environment variable is set correctly
    sampleRate: 22050,
  });

  useEffect(() => {
    if (response) {
      setText(response);
    }
  }, [response]);

  const handlePlayPause = async () => {
    if (!text) {
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
              id: 'a0e99841-438c-4a64-b679-ae501e7d6091', // Replace with your desired voice ID
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
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing TTS:', error);
    }
  };

  const handleProceed = () => {
    // Navigate to the next page or perform any action needed
    navigate('/final_reply', { state: { category, scenario, response } });
  };

  if (!category || !scenario || !response) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Card>
          <CardContent>
            <Typography variant="body1" align="center">
              Required data not provided. Please go back and start again.
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
              {category} - AI Response
            </Typography>
          }
        />
        <CardContent>
          <Typography variant="body1" align="center" paragraph>
            {response}
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
              {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
            </IconButton>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleProceed}
            >
              Continue
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
