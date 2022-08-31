import { Box, Typography } from '@mui/material';
import React from 'react';

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ pb: 2, borderBottom: 1, borderColor: 'grey.600' }}>
    <Typography variant="h3" sx={{ textAlign: 'center' }} data-testid="sectionTitle__Typography">
      {children}
    </Typography>
  </Box>
);
