import { Launch as LaunchIcon } from '@mui/icons-material';
import { AppBar, Box, Link, Stack, Typography } from '@mui/material';
import React from 'react';

import { endpoints, meta } from '@/constants';

export const Footer = () => (
  <AppBar component="footer" sx={{ position: 'static', display: 'block', p: 2 }}>
    {/* README */}
    <Box sx={{ display: 'flex', justifyContent: 'center', pb: 1 }} data-testid="Footer__ReadMe">
      <Link href={endpoints.readme} target="_blank" color="text.secondary">
        <Stack direction="row" gap={0.5} sx={{ alignItems: 'center' }}>
          <LaunchIcon sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: 14 }}>README</Typography>
        </Stack>
      </Link>
    </Box>
    {/* Copyright */}
    <Typography sx={{ textAlign: 'center', color: 'grey.400', fontSize: 14 }} data-testid="Footer__Copyright">
      {meta.copyright}
    </Typography>
    {/* Commit Hash */}
    <Typography sx={{ textAlign: 'center', color: 'grey.800', fontSize: 12 }} data-testid="Footer__Sha">
      sha: {process.env.REACT_APP_COMMIT_SHA}
    </Typography>
  </AppBar>
);
