import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Download as DownloadIcon, GitHub as GitHubIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import {
  Badge,
  BadgeProps,
  Box,
  Button,
  Container,
  experimental_sx,
  Grid,
  Link,
  Stack,
  styled,
  Theme,
  Typography,
} from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';

import { extractAlt } from '../assets';
import { constants } from '../constants';
import { products } from '../models';
import { ChipList, ChipListItem, SectionFadeIn, SectionTitle } from './controls';

const CustomSlider = styled(Slider)({ ...constants.style.zoomOnHover });

const OverlayBadge = styled(Badge)<BadgeProps>(
  experimental_sx({
    alignContent: 'bottom',
    '& .MuiBadge-badge': { top: -8, right: 0 },
  })
);

export const Products = ({ sx }: { sx?: SxProps<Theme> }) => {
  const { ref, inView } = useInView(constants.style.inViewOptions);
  const [t] = useTranslation();
  const section = constants.sections.products;

  return (
    <Box component="section" id={section} sx={{ py: 8, ...sx }}>
      <Container>
        <SectionTitle data-testid="products__SectionTitle">{section}</SectionTitle>

        <SectionFadeIn in={inView} ref={ref}>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {products.map((product, i) => (
              <React.Fragment key={`${section}__${product.id}`}>
                <Grid item xs={12} sm={7} order={{ xs: i, sm: i % 2 === 0 ? i : i + 1 }}>
                  <Typography
                    variant="h4"
                    sx={{ textAlign: 'center', fontWeight: 'bold' }}
                    data-testid={`products__product${i}--name`}
                  >
                    {t(`text.products__${product.id}--name`)}
                  </Typography>
                  <Typography
                    sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 'bold', fontSize: 24 }}
                    data-testid={`products__product${i}--summary`}
                  >
                    {product.summary}
                  </Typography>
                  <ChipList sx={{ my: 1, justifyContent: 'center' }}>
                    {product.tags.map((tag, j) => (
                      <ChipListItem
                        key={`${section}__${product.id}--tag${j}`}
                        data-testid={`products__product${i}--tag${j}`}
                      >
                        <img src={tag} alt={extractAlt(tag)} loading="lazy" />
                      </ChipListItem>
                    ))}
                  </ChipList>
                  <Typography
                    sx={{ textAlign: 'center', color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }}
                    data-testid={`products__product${i}--description`}
                  >
                    {t(`text.products__${product.id}--description`)}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      color="inherit"
                      variant="outlined"
                      href={product.code}
                      target="_blank"
                      startIcon={<GitHubIcon />}
                      sx={{ mx: 1 }}
                      data-testid={`products__product${i}--codebutton`}
                    >
                      CODE
                    </Button>
                    <Button
                      color="inherit"
                      variant="outlined"
                      href={product.page}
                      target="_blank"
                      startIcon={<OpenInNewIcon />}
                      sx={{ mx: 1 }}
                      data-testid={`products__product${i}--pagebutton`}
                    >
                      <OverlayBadge
                        invisible={!product.downloads}
                        badgeContent={
                          <Stack direction="row" sx={{ alignItems: 'center', color: 'common.white' }}>
                            <DownloadIcon fontSize="small" />
                            <Typography
                              sx={{ color: 'common.white', fontWeight: 'bold' }}
                            >{`${product.downloads}+`}</Typography>
                          </Stack>
                        }
                        color="error"
                      >
                        {product.downloads ? 'DOWNLOAD' : 'OPEN'}
                      </OverlayBadge>
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={5} order={{ xs: i + 1, sm: i % 2 === 0 ? i + 1 : i }} sx={{ mb: 4 }}>
                  <Link
                    href={product.page}
                    target="_blank"
                    color="inherit"
                    underline="hover"
                    data-testid={`products__product${i}--slider`}
                  >
                    <CustomSlider
                      infinite={true}
                      arrows={false}
                      dots={true}
                      autoplay={true}
                      autoplaySpeed={5000}
                      lazyLoad={'ondemand'}
                    >
                      {product.images.map((image, j) => (
                        <Box
                          component="img"
                          key={`${section}__${product.id}--image${j}`}
                          src={image}
                          alt={t(`text.products__${product.id}--name`)}
                          sx={{ width: 'auto', height: 'auto', borderRadius: '5px' }}
                          data-testid={`products__product${i}--image${j}`}
                        />
                      ))}
                    </CustomSlider>
                  </Link>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </SectionFadeIn>
      </Container>
    </Box>
  );
};
