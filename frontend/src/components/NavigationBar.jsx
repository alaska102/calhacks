import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <AppBar 
      position="static" 
      elevation={4} 
      sx={{ 
        background: 'linear-gradient(90deg, rgba(245,0,0,1) 0%, rgba(52,52,189,1) 56%, rgba(129,164,205,1) 100%)',
        marginBottom: 4
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo */}
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          <Box component="span" sx={{ color: 'white', fontWeight: 'bold' }}>
            crisis call{' '}
          </Box>
          <Box component="span" sx={{ color: '#81a4cd'}}>
            simulation
          </Box>
        </Typography>

        {/* Navigation Links and Start Simulation Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/about"
            sx={{ color: 'white', fontWeight: 'bold' }}
          >
            About
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/resources"
            sx={{ color: 'white', fontWeight: 'bold' }}
          >
            Resources
          </Button>
          <Button
            variant="contained"
            component={RouterLink}
            to="/practice"
            sx={{
              borderRadius: 50,
              px: 3,
              py: 1,
              color: '#FE6B8B',
              backgroundColor: 'white',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            Start Simulation
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;