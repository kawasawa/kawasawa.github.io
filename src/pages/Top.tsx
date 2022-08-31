import { Box } from '@mui/material';
import React, { useCallback, useRef } from 'react';

import { About, Articles, Banner, Footer, Header, Products } from '../components';
import { BackToTopButton } from '../components/controls';

export const Top = () => {
  const backToTopRef = useRef<HTMLDivElement>(null);
  const isVisible = useCallback(() => !!backToTopRef?.current && backToTopRef.current.offsetTop < window.scrollY, []);
  return (
    <Box sx={{ color: 'common.white', bgcolor: 'grey.900' }}>
      <Header data-testid="top__Header" />
      <Banner data-testid="top__Banner" />
      <div ref={backToTopRef} />
      <Products data-testid="top__Products" />
      <Articles data-testid="top__Articles" />
      <About data-testid="top__About" />
      <Footer data-testid="top__Footer" />
      <BackToTopButton isVisible={isVisible} data-testid="top__BackToTopButton" />
    </Box>
  );
};
