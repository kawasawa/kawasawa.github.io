import { AppBar, Typography } from '@mui/material';
import React from 'react';

import { constants } from '../constants';
import { ChipList, ChipListItem } from './controls';

export const Footer = () => (
  <AppBar sx={{ position: 'static', display: 'block', p: 2 }}>
    <Typography sx={{ textAlign: 'center', color: 'grey.400', fontSize: 14, mb: 0.5 }} data-testid="footer__copyright">
      {constants.meta.copyright}
    </Typography>
    <ChipList sx={{ justifyContent: 'center' }} data-testid="footer__tags">
      <ChipListItem data-testid="footer__tags--coverage">
        <a href={constants.url.codecov} target="_blank" rel="noreferrer">
          <img src={constants.url.codecovBadge} alt="Coverage" loading="lazy" />
        </a>
      </ChipListItem>
      <ChipListItem data-testid="footer__tags--license">
        <a href={constants.url.license} target="_blank" rel="noreferrer">
          <img src={constants.url.licenseBadge} alt="License" loading="lazy" />
        </a>
      </ChipListItem>
    </ChipList>
  </AppBar>
);
