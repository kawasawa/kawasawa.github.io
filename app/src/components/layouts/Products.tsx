import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {
  ArrowForwardIosSharp as ArrowForwardIosSharpIcon,
  Download as DownloadIcon,
  GitHub as GitHubIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
  Badge,
  BadgeProps,
  Box,
  Button,
  Container,
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
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { extractAlt } from '@/assets';
import { ChipList, ChipListItem, SectionFadeIn, SectionTitle } from '@/components/elements';
import { sections, styles, values } from '@/constants';
import { products } from '@/entities';

const OverlayBadge = styled(Badge)<BadgeProps>(({ theme }) =>
  theme.unstable_sx({
    alignContent: 'bottom',
    '& .MuiBadge-badge': { top: -8, right: 0 },
  })
);

const StyledAccordion = styled((props: AccordionProps) => <Accordion disableGutters elevation={0} square {...props} />)(
  () => ({
    border: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  })
);

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: 13, color: 'text.secondary' }} />}
    {...props}
  />
))(() => ({
  flexDirection: 'row-reverse',
  minHeight: 0,
  '& .MuiAccordionSummary-content': {
    marginLeft: 14,
    marginTop: 0,
    marginBottom: 0,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
}));

export const Products = (props: { sx?: SxProps<Theme> }) => {
  const { ref, inView } = useInView(styles.intersectionOptions);
  const [t] = useTranslation();
  const section = sections.products;

  return (
    <Box component="section" id={section} sx={{ py: 8, ...props.sx }}>
      <Container>
        <SectionTitle data-testid="Products__SectionTitle">{section}</SectionTitle>

        <SectionFadeIn in={inView} ref={ref}>
          <Stack>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              {products.slice(0, values.PRODUCTS_ALWAYS_DISPLAY_COUNT).map((product, i) => (
                <React.Fragment key={`Products__Product${i}`}>
                  <Grid item xs={12} sm={7} order={{ xs: i, sm: i % 2 === 0 ? i : i + 1 }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                      <Link
                        href={product.page}
                        target="_blank"
                        color="inherit"
                        underline="hover"
                        data-testid={`Products__Product${i}__Name`}
                      >
                        {t(`products__${product.id.toLowerCase()}__name`)}
                      </Link>
                    </Typography>
                    <Typography
                      sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 'bold', fontSize: 24 }}
                      data-testid={`Products__Product${i}__Summary`}
                    >
                      {product.summary}
                    </Typography>
                    <ChipList sx={{ my: 1, justifyContent: 'center' }}>
                      {product.tags.map((tag, j) => (
                        <ChipListItem
                          key={`Products__Product${i}__Tag${j}`}
                          data-testid={`Products__Product${i}__Tag${j}`}
                        >
                          <img src={tag} alt={extractAlt(tag)} loading="lazy" decoding="async" />
                        </ChipListItem>
                      ))}
                    </ChipList>
                    <Typography
                      sx={{ textAlign: 'center', color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }}
                      data-testid={`Products__Product${i}__Description`}
                    >
                      {t(`products__${product.id.toLowerCase()}__description`)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button
                        color="inherit"
                        variant="outlined"
                        startIcon={<GitHubIcon />}
                        sx={{ mx: 1 }}
                        onClick={() => window.open(product.code, '_blank')}
                        data-testid={`Products__Product${i}__Code`}
                      >
                        CODE
                      </Button>
                      <Button
                        color="inherit"
                        variant="outlined"
                        startIcon={<OpenInNewIcon />}
                        sx={{ mx: 1 }}
                        onClick={() => window.open(product.page, '_blank')}
                        data-testid={`Products__Product${i}__Page`}
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
                    <Box
                      data-testid={`Products__Product${i}__Slider`}
                      sx={{
                        '& .swiper-pagination-bullet': {
                          backgroundColor: 'grey.300',
                        },
                        '& .swiper-pagination-bullet-active': {
                          backgroundColor: 'common.white',
                        },
                      }}
                    >
                      <Swiper
                        slidesPerView="auto"
                        spaceBetween={50}
                        loop={true}
                        modules={[Autoplay, Pagination]}
                        autoplay={{ disableOnInteraction: false, delay: 5000 }}
                        pagination={{ clickable: true }}
                      >
                        {product.images.map((image, j) => (
                          <SwiperSlide key={`Products__Product${i}__Image${j}`}>
                            <Box
                              component="img"
                              data-testid={`Products__Product${i}__Image${j}`}
                              alt={t(`products__${product.id}__name`)}
                              src={image}
                              loading="lazy"
                              decoding="async"
                              sx={{
                                // コンテナを調整
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: 'auto',
                                // 画像を調整
                                '& img': {
                                  // 親要素のサイズが上限
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  // アスペクト比を維持
                                  objectFit: 'contain',
                                },
                              }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </Box>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>

            {values.PRODUCTS_ALWAYS_DISPLAY_COUNT < products.length && (
              <StyledAccordion
                sx={{ bgcolor: 'grey.900', mt: 10, pl: { xs: 1.5, sm: 2 }, pr: { xs: 1, sm: 2 } }}
                data-testid={`Products__Accordion`}
              >
                <StyledAccordionSummary sx={{ p: 0, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 24, color: 'text.secondary' }}>show more ...</Typography>
                </StyledAccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  {products.slice(values.PRODUCTS_ALWAYS_DISPLAY_COUNT).map((product, index) => {
                    const i = index + values.PRODUCTS_ALWAYS_DISPLAY_COUNT;
                    return (
                      <Box key={`Products__Product${i}`} sx={{ pt: 5, pl: 2 }}>
                        <Typography
                          variant="h4"
                          sx={{ display: 'inline-block', fontWeight: 'bold', mr: 2 }}
                          data-testid={`Products__Product${i}__Name`}
                        >
                          <Link href={product.page} target="_blank" color="inherit" underline="hover">
                            {t(`products__${product.id.toLowerCase()}__name`)}
                          </Link>
                        </Typography>
                        <Typography
                          sx={{ display: 'inline-block', color: 'text.secondary', fontWeight: 'bold', fontSize: 24 }}
                          data-testid={`Products__Product${i}__Summary`}
                        >
                          {product.summary}
                        </Typography>
                        <ChipList sx={{ my: 1 }}>
                          {product.tags.map((tag, j) => (
                            <ChipListItem
                              key={`Products__Product${i}__Tag${j}`}
                              data-testid={`Products__Product${i}__Tag${j}`}
                            >
                              <img src={tag} alt={extractAlt(tag)} loading="lazy" decoding="async" />
                            </ChipListItem>
                          ))}
                        </ChipList>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }}
                          data-testid={`Products__Product${i}__Description`}
                        >
                          {t(`products__${product.id.toLowerCase()}__description`)}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            color="inherit"
                            variant="outlined"
                            startIcon={<GitHubIcon />}
                            sx={{ mx: 1 }}
                            onClick={() => window.open(product.code, '_blank')}
                            data-testid={`Products__Product${i}__Code`}
                          >
                            CODE
                          </Button>
                          <Button
                            color="inherit"
                            variant="outlined"
                            startIcon={<OpenInNewIcon />}
                            sx={{ mx: 1 }}
                            onClick={() => window.open(product.page, '_blank')}
                            data-testid={`Products__Product${i}__Page`}
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
                      </Box>
                    );
                  })}
                </AccordionDetails>
              </StyledAccordion>
            )}
          </Stack>
        </SectionFadeIn>
      </Container>
    </Box>
  );
};
