import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button, Typography, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Response() {
  const [recording, setRecording] = useState(false);
  const [transcriptionComplete, setTranscriptionComplete] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { category, scenario } = location.state || {};

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
          formData.append('audio', blob, 'user_audio.wav');
          formData.append('scenario', scenario);

          try {
            await axios.post('http://localhost:5001/api/transcribe_audio', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            setTranscriptionComplete(true); // Indicate transcription is complete
          } catch (error) {
            console.error('Error transcribing audio:', error);
            alert('An error occurred while transcribing the audio.');
          }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('An error occurred while accessing the microphone.');
      }
    } else {
      // Stop recording
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleProceedToFollowUp = () => {
    // Navigate to the follow-up page, passing the necessary state
    navigate('/follow-up', {
      state: { category, scenario },
    });
  };

  if (!category || !scenario) {
    return (
      <Container>
        <Typography variant="body1">
          No category or scenario provided. Please go back and select a category.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Record Your Response
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleStartStopRecord}
        style={{ marginBottom: '20px' }}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      {transcriptionComplete && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleProceedToFollowUp}
          style={{ marginTop: '20px' }}
        >
          Proceed to Follow-Up
        </Button>
      )}
    </Container>
  );
}
