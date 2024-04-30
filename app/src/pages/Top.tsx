import { Box } from '@mui/material';
import React from 'react';

import { About, Articles, Banner, Footer, Header, Products } from '@/components';
import { BackToTopButton, Installer } from '@/components/controls';

export const Top = () => {
  const backToTopRef = React.useRef<HTMLDivElement>(null);
  const isVisible = React.useCallback(
    () => !!backToTopRef?.current && backToTopRef.current.offsetTop < window.scrollY,
    []
  );

  return (
    <Box sx={{ color: 'common.white', bgcolor: 'grey.900' }}>
      <Header data-testid="Top__Header" />
      <Banner data-testid="Top__Banner" />
      <div ref={backToTopRef} />
      <Products data-testid="Top__Products" />
      <Articles data-testid="Top__Articles" />
      <About data-testid="Top__About" />
      <Footer data-testid="Top__Footer" />
      <Installer data-testid="Top__InstallButton" />
      <BackToTopButton isVisible={isVisible} data-testid="Top__BackToTopButton" />
    </Box>
  );
};
