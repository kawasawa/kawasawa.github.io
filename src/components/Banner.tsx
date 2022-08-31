// import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Alert, Box, Container, experimental_sx, styled, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { Freeze } from 'react-freeze';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
// import { Link as ScrollLink } from 'react-scroll';
import Particles from 'react-tsparticles';
import Typed from 'react-typed';

import imageBanner from '../assets/banner.webp';
import { constants } from '../constants';
import { stringFormat } from '../utils/strings';
import { SectionFadeIn } from './controls';

const Image = styled(Box)(
  experimental_sx({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  })
);

// const ScrollArrow = () => (
//   <ScrollLink
//     to={constants.sections.products}
//     smooth={true}
//     offset={-60}
//     style={{ cursor: 'pointer', position: 'absolute', bottom: 32 }}
//   >
//     <KeyboardArrowDownIcon />
//   </ScrollLink>
// );

export const Banner = () => {
  const { ref, inView } = useInView(constants.style.inViewOptions);
  const [t] = useTranslation();

  const bannerTexts = [`I'm ${constants.meta.author}.`, 'Welcome to my portfolio site.'];
  const bannerFormats = [
    'print("{0}")',
    'cat("{0}")',
    'NSLog(@"{0}")',
    'DISPLAY "{0}"',
    'puts "{0}"',
    'write("{0}")',
    'ECHO {0}',
  ];
  const strings = [];
  for (let i = 0; i < bannerFormats.length * bannerTexts.length; i++)
    strings.push(stringFormat(bannerFormats[i % bannerFormats.length], bannerTexts[i % bannerTexts.length]));

  const onAlertClick = useCallback(() => window.open(constants.url.readme, '_blank'), []);

  return (
    <SectionFadeIn in={inView} ref={ref}>
      <Box>
        <Image sx={{ backgroundImage: `url(${imageBanner})` }} data-testid="banner__image" />
        <Freeze freeze={!inView}>
          <Particles
            options={{
              style: {
                position: 'absolute',
              },
              particles: {
                color: {
                  value: '#ff0000',
                  animation: { h: { enable: true, speed: 100 } },
                },
                opacity: {
                  value: 0.7,
                },
                size: {
                  value: { min: 0.1, max: 3 },
                },
                number: {
                  value: 70,
                  density: { enable: true },
                },
                move: {
                  enable: true,
                  speed: 3,
                },
                links: {
                  enable: true,
                  opacity: 0.7,
                  color: { value: '#ffffff' },
                },
              },
              // interactivity: {
              //   events: {
              //     onHover: { enable: true, mode: 'repulse' },
              //     onClick: { enable: true, mode: 'repulse' },
              //   },
              // },
            }}
            data-testid="banner__particles"
          />
        </Freeze>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Container sx={{ color: 'common.white', zIndex: 1 }}>
            <Box
              sx={{
                bgcolor: '#111d',
                borderRadius: 2,
                boxShadow: 1,
                p: { xs: 2, sm: 4 },
                mb: 8,
              }}
            >
              <Typography sx={{ fontSize: 32, fontWeight: 'bold' }} data-testid="banner__text">
                <Typed strings={strings} typeSpeed={50} backSpeed={20} backDelay={1800} loop />
              </Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ScrollArrow />
            </Box> */}
          </Container>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: '10px',
            bottom: '10px',
          }}
        >
          <Alert severity="info" sx={{ cursor: 'pointer' }} onClick={onAlertClick} data-testid="banner__alert">
            {t('message.notify__banner--alert')}
          </Alert>
        </Box>
      </Box>
    </SectionFadeIn>
  );
};
