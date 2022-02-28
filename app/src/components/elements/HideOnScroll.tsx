import { Slide, useScrollTrigger } from '@mui/material';
import React from 'react';

export const HideOnScroll = React.memo(function _(props: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide direction="down" appear={false} in={!trigger}>
      {props.children}
    </Slide>
  );
});
