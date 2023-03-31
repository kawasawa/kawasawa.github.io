import { AppBar, Typography } from '@mui/material';
import React from 'react';

import { ChipList, ChipListItem } from '@/components/controls';
import { endpoints, meta } from '@/constants';

export const Footer = () => (
  <AppBar component="footer" sx={{ position: 'static', display: 'block', p: 2 }}>
    <ChipList sx={{ justifyContent: 'center' }}>
      <ChipListItem data-testid="Footer__Tags__GitHub">
        <img src={endpoints.githubBadge} alt="GitHub Status" loading="lazy" decoding="async" />
      </ChipListItem>
      <ChipListItem data-testid="Footer__Tags__Codecov">
        <img src={endpoints.codecovBadge} alt="Codecov Status" loading="lazy" decoding="async" />
      </ChipListItem>
    </ChipList>
    <Typography sx={{ textAlign: 'center', color: 'grey.400', fontSize: 14 }} data-testid="Footer__Copyright">
      {meta.copyright}
    </Typography>
  </AppBar>
);
