import React from 'react';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Box,
  Paper,
  IconButton
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f0f0f0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 400,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
        },
      },
    },
  },
});

const categories = [
  'Substance Abuse',
  'Domestic Violence',
  'Eating Disorder',
  'Sexual Harrasment',
  'Suicide Prevention',
  'Sexual Abuse',
  'Gambling Addiction'
];

export default function Practice() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="sm">
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            <span style={{ color: '#757575' }}>hotline</span>
            <span style={{ color: '#3f51b5' }}>warm</span>
            <span style={{ color: '#f50057' }}>up</span>
          </Typography>
          <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4, color: '#424242' }}>
            What category do you want to practice?
          </Typography>
          <List sx={{ mt: 4 }}>
            {categories.map((category, index) => (
              <Paper key={index} sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
                <ListItem 
                  button 
                  sx={{ 
                    py: 2,
                    '&:hover': { 
                      bgcolor: 'rgba(0, 0, 0, 0.03)',
                    },
                  }}
                >
                  <ListItemText 
                    primary={category} 
                    primaryTypographyProps={{ 
                      sx: { fontWeight: 500, color: '#424242' } 
                    }}
                  />
                  <IconButton edge="end" aria-label="select">
                    <ChevronRight />
                  </IconButton>
                </ListItem>
              </Paper>
            ))}
          </List>
        </Container>
      </Box>
    </ThemeProvider>
  );
}