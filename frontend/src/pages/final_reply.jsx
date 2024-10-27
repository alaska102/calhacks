import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button, Typography, Container, Box, createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Mic, Stop } from '@mui/icons-material';

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

export default function FinalReply() {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  const handleStartStopRecord = async () => {
    if (!recording) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support audio recording');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const formData = new FormData();
          formData.append('audio', blob, 'user_reply_audio.wav');

          try {
            await axios.post('http://localhost:5001/api/transcribe_audio', formData);
          } catch (error) {
            console.error('Error transcribing audio:', error);
          }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleProceedToInsights = async () => {
    try {
      const insightsResponse = await axios.get('http://localhost:5001/api/insights');
      navigate('/insights', {
        state: { ...insightsResponse.data }
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
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
            Record Your Reply
          </Typography>
          <Box display="flex" justifyContent="center" mb={4}>
            <Button
              variant="contained"
              color={recording ? "secondary" : "primary"}
              onClick={handleStartStopRecord}
              startIcon={recording ? <Stop /> : <Mic />}
              sx={{
                bgcolor: recording ? '#ff4081' : 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { bgcolor: recording ? '#f50057' : 'rgba(255,255,255,0.3)' },
                py: 2,
                px: 4,
                borderRadius: 50,
              }}
            >
              {recording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </Box>
          {!recording && (
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                onClick={handleProceedToInsights}
                sx={{
                  bgcolor: '#ff4081',
                  color: 'white',
                  '&:hover': { bgcolor: '#f50057' },
                  py: 2,
                  px: 4,
                  borderRadius: 50,
                }}
              >
                Proceed to Insights
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}