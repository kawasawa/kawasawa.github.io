import { Box, Typography } from '@mui/material';
import React from 'react';

export const SectionTitle = (props: { children: React.ReactNode }) => (
  <Box sx={{ pb: 2, borderBottom: 1, borderColor: 'grey.600' }}>
    <Typography variant="h3" sx={{ textAlign: 'center' }} data-testid="SectionTitle__Typography">
      {props.children}
    </Typography>
  </Box>
);
