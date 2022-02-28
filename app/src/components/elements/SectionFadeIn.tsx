import { Fade, FadeProps } from '@mui/material';
import React from 'react';

export const SectionFadeIn = React.forwardRef(function _(props: FadeProps & { in: boolean }, ref?) {
  return (
    <Fade timeout={props.timeout ?? 1000} ref={ref} {...props} data-testid="SectionFadeIn__Fade">
      {props.children}
    </Fade>
  );
});
