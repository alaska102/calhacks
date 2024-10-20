import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button, Typography, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FinalReply() {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { category, scenario, response } = location.state || {};

  const handleStartStopRecord = async () => {
    if (!recording) {
      // Start recording
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
          formData.append('scenario', scenario);

          try {
            const response = await axios.post(
              'http://localhost:5001/api/transcribe_audio',
              formData
            );
            setTranscription(response.data.transcription); // Store the transcription of the user's reply
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
      // Stop recording
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

  if (!category || !scenario || !response) {
    return (
      <Container>
        <Typography variant="body1">
          Required data not provided. Please go back and try again.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Record Your Reply
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        AI Response: {response}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleStartStopRecord}
        style={{ marginBottom: '20px' }}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      {transcription && (
        <>
          <Typography variant="body1" style={{ marginTop: '20px' }}>
            Your Reply: {transcription}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleProceedToInsights}
            style={{ marginTop: '20px' }}
          >
            Proceed to Insights
          </Button>
        </>
      )}
    </Container>
  );
}
