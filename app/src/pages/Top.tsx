import { Launch as LaunchIcon } from '@mui/icons-material';
import { Box, Link, Stack, Typography } from '@mui/material';
import React, { useCallback, useRef } from 'react';

import { About, Articles, Banner, Footer, Header, Products } from '@/components';
import { BackToTopButton } from '@/components/controls';
import { endpoints } from '@/constants';

export const Top = () => {
  const backToTopRef = useRef<HTMLDivElement>(null);
  const isVisible = useCallback(() => !!backToTopRef?.current && backToTopRef.current.offsetTop < window.scrollY, []);
  return (
    <Box sx={{ color: 'common.white', bgcolor: 'grey.900' }}>
      <Header data-testid="Top__Header" />
      <Banner data-testid="Top__Banner" />
      <div ref={backToTopRef} />
      <Products data-testid="Top__Products" />
      <Articles data-testid="Top__Articles" />
      <About data-testid="Top__About" />
      <Box sx={{ display: 'flex', justifyContent: 'center', pb: 5 }} data-testid="Top__ReadMe">
        <Link href={endpoints.readme} target="_blank" color="inherit" underline="hover">
          <Stack direction="row" gap={0.5} sx={{ alignItems: 'center' }}>
            <LaunchIcon sx={{ fontSize: 18, color: 'grey.500' }} />
            <Typography sx={{ fontSize: 18, color: 'grey.500' }}>README</Typography>
          </Stack>
        </Link>
      </Box>
      <Footer data-testid="Top__Footer" />
      <BackToTopButton isVisible={isVisible} data-testid="Top__BackToTopButton" />
    </Box>
  );
};
