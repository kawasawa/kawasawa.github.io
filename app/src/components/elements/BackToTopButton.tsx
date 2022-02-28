import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { Box, Fab } from '@mui/material';
import React from 'react';

import { SectionFadeIn } from '@/components/elements';
import { scrollToTop } from '@/utils/elements';

export const BackToTopButton = (props: { isVisible: () => boolean }) => {
  const { isVisible } = props;
  const [visible, setVisible] = React.useState(false);

  const backToTop = React.useCallback(() => {
    scrollToTop();
  }, []);

  React.useEffect(() => {
    const onScroll = () => setVisible(isVisible());
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isVisible]);

  return (
    <Box sx={{ position: 'fixed', right: 24, bottom: 40, zIndex: 1, opacity: 0.75 }}>
      <SectionFadeIn in={visible}>
        <Fab onClick={backToTop} sx={{ width: 40, height: 40 }} data-testid="BackToTopButton__Fab">
          <KeyboardArrowUpIcon />
        </Fab>
      </SectionFadeIn>
    </Box>
  );
};
