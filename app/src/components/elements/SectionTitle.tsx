import { Box, Typography } from '@mui/material';
import React from 'react';

export const SectionTitle = React.memo(function _(props: { children: React.ReactNode }) {
  return (
    <Box sx={{ pb: 2, borderBottom: 1, borderColor: 'grey.600' }}>
      <Typography variant="h3" sx={{ textAlign: 'center' }} data-testid="SectionTitle__Typography">
        {props.children}
      </Typography>
    </Box>
  );
});
