import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Container, 
  Box,
  createTheme,
  ThemeProvider
} from '@mui/material';

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

const categories = [
  'Substance Abuse',
  'Domestic Violence',
  'Eating Disorder',
  'Sexual Harassment',
  'Suicide Prevention',
  'Sexual Abuse',
  'Gambling Addiction',
];

export default function Practice() {
  const navigate = useNavigate();

  const fetchScenario = async (category) => {
    try {
      const response = await axios.post('http://localhost:5001/api/generate_scenario', { genre: category });
      if (response.data && response.data.scenario) {
        return response.data.scenario;
      } else {
        console.error('No scenario data returned from the backend');
        return null;
      }
    } catch (error) {
      console.error('Error fetching scenario:', error);
      return null;
    }
  };

  const handleCategoryClick = async (category) => {
    const scenario = await fetchScenario(category);
    if (scenario) {
      navigate('/category', { state: { category, scenario } });
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
          <Typography variant="h5" align="center" paragraph>
            Select a category to practice:
          </Typography>
          <List>
            {categories.map((category, index) => (
              <ListItem 
                key={index} 
                onClick={() => handleCategoryClick(category)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText 
                  primary={category} 
                  primaryTypographyProps={{
                    align: 'center',
                    sx: { 
                      color: 'white',
                      fontWeight: 'medium',
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Container>
      </Box>
    </ThemeProvider>
  );
}