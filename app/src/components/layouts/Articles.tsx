import { Inventory as InventoryIcon, SellOutlined as SellIcon, ThumbUp as ThumbUpIcon } from '@mui/icons-material';
import {
  Badge,
  BadgeProps,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
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

import { ChipList, ChipListItem, SectionFadeIn, SectionTitle } from '@/components/elements';
import { sections, styles, values } from '@/constants';
import { useArticles } from '@/hooks';
import { LocaleCodes } from '@/utils/localization';

const OverlayBadge = styled(Badge)<BadgeProps>(({ theme }) =>
  theme.unstable_sx({
    '& .MuiBadge-badge': { top: 5, right: 28 },
  })
);

export const Articles = (props: { sx?: SxProps<Theme> }) => {
  const { ref, inView } = useInView(styles.intersectionOptions);
  const [_, i18n] = useTranslation();
  const articles = useArticles(inView);
  const section = sections.articles;

  return (
    <Box component="section" id={section} sx={{ py: 8, ...props.sx }}>
      <Container>
        <SectionTitle data-testid="Articles__SectionTitle">{section}</SectionTitle>

        <Box ref={ref}>
          {articles ? (
            <SectionFadeIn in={inView}>
              <Grid container spacing={4} sx={{ mt: 2 }}>
                {Object.values(articles).map((article, i) => {
                  const title = article[`title_${i18n.language as LocaleCodes}` as keyof typeof article] as string;
                  const body = article[`body_${i18n.language as LocaleCodes}` as keyof typeof article] as string;
                  return (
                    <Grid item key={`Articles__Card${i}`} xs={12} sm={6} md={4}>
                      <Card sx={{ ...styles.hoverOptions }}>
                        <CardActionArea
                          sx={{ p: 1 }}
                          onClick={() => window.open(article.url, '_blank')}
                          data-testid={`Articles__Card${i}__CardActionArea`}
                        >
                          <OverlayBadge
                            invisible={
                              !(article.likesCount && values.ARTICLES_LIKES_COUNT_THRESHOLD <= article.likesCount)
                            }
                            badgeContent={
                              <Stack direction="row" gap={0.5} sx={{ alignItems: 'center', color: 'common.white' }}>
                                <ThumbUpIcon fontSize="small" />
                                {/* eslint-disable @typescript-eslint/no-non-null-assertion */}
                                <Typography sx={{ fontWeight: 'bold' }}>{`${article
                                  .likesCount!.toString()
                                  .slice(0, 1)}${'0'.repeat(article.likesCount!.toString().length - 1)}+`}</Typography>
                                {/* eslint-enable @typescript-eslint/no-non-null-assertion */}
                              </Stack>
                            }
                            color={
                              article.likesCount && values.ARTICLES_LIKES_COUNT_POPULAR <= article.likesCount
                                ? 'error'
                                : 'secondary'
                            }
                          >
                            <CardMedia
                              component="img"
                              src={article.image}
                              alt={title}
                              loading="lazy"
                              decoding="async"
                            />
                          </OverlayBadge>
                          <CardContent>
                            <Typography
                              sx={{ fontSize: 14, color: 'text.secondary' }}
                              data-testid={`Articles__Card${i}__Body`}
                            >
                              {body}
                            </Typography>
                          </CardContent>
                          <CardActions
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', pt: 0 }}
                          >
                            <ChipList>
                              {article.tags?.map((tag, j) => (
                                <ChipListItem
                                  key={`Articles__Card${i}__Tag${j}`}
                                  data-testid={`Articles__Card${i}__Tag${j}`}
                                >
                                  <Chip
                                    icon={<SellIcon color="disabled" />}
                                    label={tag}
                                    size="small"
                                    sx={{ borderRadius: 1, mt: 0.5, height: 'auto', color: 'grey.300' }}
                                  />
                                </ChipListItem>
                              ))}
                            </ChipList>
                            <Stack direction="row" gap={1} sx={{ ml: 1 }}>
                              <Stack direction="row" gap={0.5} sx={{ alignItems: 'center', color: 'grey.300' }}>
                                <ThumbUpIcon sx={{ fontSize: 18 }} />
                                <Typography data-testid={`Articles__Card${i}__LikesCount`}>
                                  {article.likesCount}
                                </Typography>
                              </Stack>
                              <Stack direction="row" gap={0.5} sx={{ alignItems: 'center', color: 'grey.300' }}>
                                <InventoryIcon sx={{ fontSize: 18 }} />
                                <Typography data-testid={`Articles__Card${i}__StocksCount`}>
                                  {article.stocksCount}
                                </Typography>
                              </Stack>
                            </Stack>
                          </CardActions>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </SectionFadeIn>
          ) : (
            <Grid container spacing={4} sx={{ mt: 2 }}>
              {[...Array(values.ARTICLES_SKELETON_DISPLAY_COUNT).keys()].map((i) => (
                <Grid
                  item
                  key={`Articles__Card${i}--Loading`}
                  data-testid={`Articles__Card${i}--Loading`}
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <Card sx={{ p: 1 }}>
                    <Skeleton animation="wave" variant="rectangular" sx={{ height: '180px' }} />
                    <CardContent>
                      {[...Array(4).keys()].reverse().map((n) => (
                        <Skeleton
                          key={`Articles__Card${i}__SkeletonBody${n}`}
                          data-testid={`Articles__Card${i}__SkeletonBody${n}`}
                          animation="wave"
                          variant="text"
                          sx={{ height: 10, mt: 1.5, width: n ? '100%' : '80%' }}
                        />
                      ))}
                    </CardContent>
                    <CardActions>
                      {[...Array(2)].map((_, j) => (
                        <Skeleton
                          key={`Articles__Card${i}__SkeletonTag${j}`}
                          data-testid={`Articles__Card${i}__SkeletonTag${j}`}
                          animation="wave"
                          variant="rectangular"
                          sx={{ height: 20, width: '15%' }}
                        />
                      ))}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};
