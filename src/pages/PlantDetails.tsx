import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PlantDetails: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Plant Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed plant information page - coming soon!
        </Typography>
      </Box>
    </Container>
  );
};

export default PlantDetails; 