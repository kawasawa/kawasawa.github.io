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
  Skeleton,
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

import { ChipList, ChipListItem, SectionFadeIn, SectionTitle } from '@/components/elements';
import { sections, styles, values } from '@/constants';
import { useProducts } from '@/hooks';
import { extractAltText4ShieldsIo } from '@/utils/strings';

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
  const [_, i18n] = useTranslation();
  const products = useProducts(inView);
  const section = sections.products;

  return (
    <Box component="section" id={section} sx={{ py: 8, ...props.sx }}>
      <Container>
        <SectionTitle data-testid="Products__SectionTitle">{section}</SectionTitle>

        <Box ref={ref}>
          {products ? (
            <SectionFadeIn in={inView}>
              <Stack>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                  {products
                    .filter((product) => product.visible && product.pickup)
                    .map((product, i) => {
                      const title = product[`title_${i18n.language}` as keyof typeof product] as string;
                      const subject = product[`subject_${i18n.language}` as keyof typeof product] as string;
                      const body = product[`body_${i18n.language}` as keyof typeof product] as string;
                      return (
                        <React.Fragment key={`Products__Product${i}`}>
                          <Grid item xs={12} sm={7} order={{ xs: i, sm: i % 2 === 0 ? i : i + 1 }}>
                            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                              <Link
                                href={product.url_home}
                                target="_blank"
                                color="inherit"
                                underline="hover"
                                data-testid={`Products__Product${i}__Name`}
                              >
                                {title}
                              </Link>
                            </Typography>
                            <Typography
                              sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 'bold', fontSize: 24 }}
                              data-testid={`Products__Product${i}__Summary`}
                            >
                              {subject}
                            </Typography>
                            <ChipList sx={{ my: 1, justifyContent: 'center' }}>
                              {product.skills.map((skill, j) => (
                                <ChipListItem
                                  key={`Products__Product${i}__Skill${j}`}
                                  data-testid={`Products__Product${i}__Skill${j}`}
                                >
                                  <img
                                    src={skill.icon}
                                    alt={extractAltText4ShieldsIo(skill.icon)}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                </ChipListItem>
                              ))}
                            </ChipList>
                            <Typography
                              sx={{ textAlign: 'center', color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }}
                              data-testid={`Products__Product${i}__Description`}
                            >
                              {body}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                              <Button
                                color="inherit"
                                variant="outlined"
                                startIcon={<GitHubIcon />}
                                sx={{ mx: 1 }}
                                onClick={() => window.open(product.url_code, '_blank')}
                                data-testid={`Products__Product${i}__Code`}
                              >
                                CODE
                              </Button>
                              <Button
                                color="inherit"
                                variant="outlined"
                                startIcon={<OpenInNewIcon />}
                                sx={{ mx: 1 }}
                                onClick={() => window.open(product.url_home, '_blank')}
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
                                {product.images
                                  ?.sort((a, b) => a.rowNo - b.rowNo)
                                  .map((image, j) => (
                                    <SwiperSlide key={`Products__Product${i}__Image${j}`}>
                                      <Box
                                        component="img"
                                        data-testid={`Products__Product${i}__Image${j}`}
                                        alt={title}
                                        src={image.data}
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
                      );
                    })}
                </Grid>

                {0 < (products?.filter((product) => product.visible && !product.pickup).length ?? 0) && (
                  <StyledAccordion
                    sx={{ bgcolor: 'grey.900', mt: 10, pl: { xs: 1.5, sm: 2 }, pr: { xs: 1, sm: 2 } }}
                    data-testid={`Products__Accordion`}
                  >
                    <StyledAccordionSummary sx={{ p: 0, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: 24, color: 'text.secondary' }}>show more ...</Typography>
                    </StyledAccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      {products
                        ?.filter((product) => product.visible && !product.pickup)
                        .map((product, index) => {
                          const title = product[`title_${i18n.language}` as keyof typeof product] as string;
                          const subject = product[`subject_${i18n.language}` as keyof typeof product] as string;
                          const body = product[`body_${i18n.language}` as keyof typeof product] as string;
                          const i =
                            index + (products?.filter((product) => product.visible && product.pickup).length ?? 0);
                          return (
                            <Box key={`Products__Product${i}`} sx={{ pt: 5, pl: 2 }}>
                              <Typography
                                variant="h4"
                                sx={{ display: 'inline-block', fontWeight: 'bold', mr: 2 }}
                                data-testid={`Products__Product${i}__Name`}
                              >
                                <Link href={product.url_home} target="_blank" color="inherit" underline="hover">
                                  {title}
                                </Link>
                              </Typography>
                              <Typography
                                sx={{
                                  display: 'inline-block',
                                  color: 'text.secondary',
                                  fontWeight: 'bold',
                                  fontSize: 24,
                                }}
                                data-testid={`Products__Product${i}__Summary`}
                              >
                                {subject}
                              </Typography>
                              <ChipList sx={{ my: 1 }}>
                                {product.skills.map((skill, j) => (
                                  <ChipListItem
                                    key={`Products__Product${i}__Skill${j}`}
                                    data-testid={`Products__Product${i}__Skill${j}`}
                                  >
                                    <img
                                      src={skill.icon}
                                      alt={extractAltText4ShieldsIo(skill.icon)}
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </ChipListItem>
                                ))}
                              </ChipList>
                              <Typography
                                sx={{ color: 'text.secondary', fontSize: { xs: 18, sm: 20 } }}
                                data-testid={`Products__Product${i}__Description`}
                              >
                                {body}
                              </Typography>
                              <Box sx={{ mt: 2 }}>
                                <Button
                                  color="inherit"
                                  variant="outlined"
                                  startIcon={<GitHubIcon />}
                                  sx={{ mx: 1 }}
                                  onClick={() => window.open(product.url_code, '_blank')}
                                  data-testid={`Products__Product${i}__Code`}
                                >
                                  CODE
                                </Button>
                                <Button
                                  color="inherit"
                                  variant="outlined"
                                  startIcon={<OpenInNewIcon />}
                                  sx={{ mx: 1 }}
                                  onClick={() => window.open(product.url_home, '_blank')}
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
          ) : (
            <Grid container spacing={4} sx={{ mt: 2 }}>
              {[...Array(values.skeltonCount.products).keys()].map((i) => (
                <React.Fragment key={`Products__Product${i}--Loading`}>
                  <Grid
                    item
                    xs={12}
                    sm={7}
                    order={{ xs: i, sm: i % 2 === 0 ? i : i + 1 }}
                    data-testid={`Products__Product${i}--Loading`}
                  >
                    <Stack sx={{ alignItems: 'center' }}>
                      <Skeleton
                        data-testid={`Products__Product${i}__SkeletonName`}
                        animation="wave"
                        variant="text"
                        sx={{ height: 50, mt: 1.5, width: '30%' }}
                      />
                      <Skeleton
                        data-testid={`Products__Product${i}__SkeletonSummary`}
                        animation="wave"
                        variant="text"
                        sx={{ height: 30, mt: 1.5, width: '50%' }}
                      />
                      {[...Array(4).keys()].reverse().map((n) => (
                        <Skeleton
                          key={`Products__Product${i}__SkeletonDescription${n}`}
                          data-testid={`Products__Product${i}__SkeletonDescription${n}`}
                          animation="wave"
                          variant="text"
                          sx={{ height: 30, mt: 1.5, width: n ? '100%' : '80%' }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={5} order={{ xs: i + 1, sm: i % 2 === 0 ? i + 1 : i }} sx={{ mb: 4 }}>
                    <Skeleton
                      data-testid={`Products__Product${i}__SkeletonImage`}
                      animation="wave"
                      variant="rectangular"
                      sx={{ height: 250, mt: 2.5 }}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};
