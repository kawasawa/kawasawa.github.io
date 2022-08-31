import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { Box, Fab } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { animateScroll } from 'react-scroll';

import { SectionFadeIn } from '.';

export const BackToTopButton = ({ isVisible }: { isVisible: () => boolean }) => {
  const [visible, setVisible] = useState(false);

  const backToTop = useCallback(() => {
    animateScroll.scrollToTop();
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(isVisible());
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isVisible]);

  return (
    <Box sx={{ position: 'fixed', right: 24, bottom: 40, zIndex: 1, opacity: 0.75 }}>
      <SectionFadeIn in={visible}>
        <Fab onClick={backToTop} sx={{ width: 40, height: 40 }}>
          <KeyboardArrowUpIcon />
        </Fab>
      </SectionFadeIn>
    </Box>
  );
};
