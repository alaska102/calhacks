import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Container, Card, CardContent } from '@mui/material';

export default function Insights() {
  const location = useLocation();
  const { insights } = location.state || {};

  if (!insights) {
    return (
      <Container>
        <Typography variant="body1">
          Insights data is missing. Please restart the process.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: '100%', maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Conversation Insights
          </Typography>
          <Typography variant="body1" gutterBottom>
            {insights.summary}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Total Turns: {insights.total_turns}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
