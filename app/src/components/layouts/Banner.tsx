import { KeyboardDoubleArrowDown as KeyboardDoubleArrowDownIcon } from '@mui/icons-material';
import { Box, Container, styled, Typography } from '@mui/material';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import Particles from 'react-tsparticles';
import Typed from 'react-typed';

import imageBanner from '@/assets/banner.webp';
import { SectionFadeIn } from '@/components/elements';
import { meta, sections, styles } from '@/constants';
import { stringFormat } from '@/utils/strings';

const Image = styled(Box)(({ theme }) =>
  theme.unstable_sx({
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

const FreezableParticles = React.memo(function _({ inView }: { inView: boolean }) {
  if (!inView) {
    console.debug('particles is hidden.');
    return null;
  }

  console.debug('particles rendered');
  return (
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
      }}
      data-testid="Banner__Particles"
    />
  );
});

export const Banner = () => {
  const { ref, inView } = useInView(styles.intersectionOptions);

  const handleScrollClick = React.useCallback(() => {
    const element = document.getElementById(sections.products);
    if (element) {
      const offset = -20;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition + offset,
        behavior: 'smooth',
      });
    }
  }, []);

  const bannerTexts = [`I'm ${meta.author}.`, 'Welcome to my portfolio site.'];
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

  return (
    <SectionFadeIn in={inView} ref={ref}>
      <Box>
        {
          // ------------------------------------------------------------------------------
          // イメージ
          // ------------------------------------------------------------------------------
        }
        <Image sx={{ backgroundImage: `url(${imageBanner})` }} data-testid="Banner__Image" />

        {
          // ------------------------------------------------------------------------------
          // パーティクル
          // ------------------------------------------------------------------------------
        }
        <FreezableParticles inView={inView} />

        {
          // ------------------------------------------------------------------------------
          // テキストエフェクト
          // ------------------------------------------------------------------------------
        }
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Container sx={{ zIndex: 1 }}>
            <Box
              sx={{
                color: 'common.white',
                bgcolor: '#111d',
                borderRadius: 2,
                boxShadow: 1,
                p: { xs: 2, sm: 4 },
                mb: 8, // 若干上寄りに配置する
              }}
            >
              <Typography sx={{ fontSize: 32, fontWeight: 'bold' }} data-testid="Banner__Text">
                <Typed strings={strings} typeSpeed={50} backSpeed={20} backDelay={1800} loop />
              </Typography>
            </Box>
          </Container>
        </Box>

        {
          // ------------------------------------------------------------------------------
          // スクロールアロー
          // ------------------------------------------------------------------------------
        }
        <Box
          sx={{
            position: 'absolute',
            bottom: '20vh',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <style>
            {`@keyframes move-y {
              from { transform: translateY(0); }
              to { transform: translateY(10px); }
            }`}
          </style>
          <KeyboardDoubleArrowDownIcon
            onClick={handleScrollClick}
            sx={{
              width: 40,
              height: 40,
              cursor: 'pointer',
              color: 'common.white',
              // アニメーションを増やすと煩いので一旦オフ
              // animation: 'move-y .75s infinite alternate ease-in-out',
            }}
            data-testid="Banner__ScrollArrow"
          />
        </Box>
      </Box>
    </SectionFadeIn>
  );
};
