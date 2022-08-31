import { Fade, FadeProps } from '@mui/material';
import React from 'react';

export const SectionFadeIn = React.forwardRef<
  unknown,
  FadeProps & {
    in: boolean;
  }
>(function _(props, ref?) {
  return (
    <Fade timeout={props.timeout ?? 1000} ref={ref} {...props} data-testid="sectionFadeIn__Fade">
      {props.children}
    </Fade>
  );
});
