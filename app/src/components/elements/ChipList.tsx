import { styled } from '@mui/material';

export const ChipList = styled('ul')(({ theme }) =>
  theme.unstable_sx({
    display: 'flex',
    justifyContent: 'start',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  })
);

export const ChipListItem = styled('li')(({ theme }) =>
  theme.unstable_sx({
    mx: 0.25,
  })
);
