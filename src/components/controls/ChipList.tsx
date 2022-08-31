import { experimental_sx, styled } from '@mui/material';

export const ChipList = styled('ul')(
  experimental_sx({
    display: 'flex',
    justifyContent: 'start',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  })
);

export const ChipListItem = styled('li')(
  experimental_sx({
    mx: 0.25,
  })
);
