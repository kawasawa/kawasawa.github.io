import { GitHub as GitHubIcon, LinkedIn as LinkedInIcon, Twitter as TwitterIcon } from '@mui/icons-material';
import { SvgIcon } from '@mui/material';
import { createSvgIcon } from '@mui/material/utils';
import React from 'react';

type SNS = Readonly<{
  name: string;
  icon: typeof SvgIcon;
  url: string;
}>;

export const sns: SNS[] = [
  {
    name: 'Twitter',
    icon: TwitterIcon,
    url: 'https://twitter.com/k_awasawa',
  },
  {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    url: 'https://www.linkedin.com/in/kawasawa',
  },
  {
    name: 'GitHub',
    icon: GitHubIcon,
    url: 'https://github.com/kawasawa',
  },
  {
    name: 'Qiita',
    icon: createSvgIcon(
      <path d="M 22.14 10.98 C 22.14 5.58 18 0 10.98 0 C 5.58 0 0 4.14 0 11.16 c 0 5.4 4.14 10.98 11.16 10.98 c 2.25 0 4.5 -0.72 6.39 -2.07 l 3.24 3.24 l 1.44 -1.44 l -3.06 -3.06 c 1.89 -2.07 2.97 -4.77 2.97 -7.83 z m -11.16 -9 c 5.13 0 9.18 3.96 9.18 9.09 c 0 4.41 -3.42 9.09 -9.09 9.09 s -9.09 -4.59 -9.09 -9 c 0 -5.76 4.59 -9.18 9 -9.18 z" />,
      'Qiita'
    ),
    url: 'https://qiita.com/kawasawa',
  },
];
