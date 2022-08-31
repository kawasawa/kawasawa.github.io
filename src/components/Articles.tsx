import { ThumbUp as ThumbUpIcon } from '@mui/icons-material';
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
  experimental_sx,
  Grid,
  Skeleton,
  Stack,
  styled,
  Theme,
  Typography,
} from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import { constants } from '../constants';
import { useArticles } from '../hooks';
import { articles as articleIds } from '../models';
import { ChipList, ChipListItem, SectionFadeIn, SectionTitle } from './controls';

const OverlayBadge = styled(Badge)<BadgeProps>(
  experimental_sx({
    '& .MuiBadge-badge': { top: 5, right: 28 },
  })
);

export const Articles = ({ sx }: { sx?: SxProps<Theme> }) => {
  const { ref, inView } = useInView(constants.style.inViewOptions);
  const articles = useArticles(inView);
  const section = constants.sections.articles;
  const LIKES_COUNT_THRESHOLD = 100;

  return (
    <Box component="section" id={section} sx={{ py: 8, ...sx }}>
      <Container>
        <SectionTitle data-testid="articles__SectionTitle">{section}</SectionTitle>

        <Box ref={ref}>
          {articles ? (
            <SectionFadeIn in={inView}>
              <Grid container spacing={4} sx={{ mt: 2 }}>
                {Object.values(articles).map((article, i) => (
                  <Grid item key={`${section}__article${i}`} xs={12} sm={6} md={4}>
                    <Card sx={{ ...constants.style.zoomOnHover }}>
                      <CardActionArea
                        sx={{ p: 1 }}
                        onClick={() => window.open(article.url, '_blank')}
                        data-testid={`articles__article${i}--CardActionArea`}
                      >
                        <OverlayBadge
                          invisible={!(article.likesCount && LIKES_COUNT_THRESHOLD <= article.likesCount)}
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
                          color="error"
                        >
                          <CardMedia component="img" image={article.image} alt={article.title} />
                        </OverlayBadge>
                        <CardContent data-testid={`articles__article${i}--title`}>
                          <Typography sx={{ fontSize: 17 }} gutterBottom>
                            {article.title}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 14, color: 'text.secondary' }}
                            data-testid={`articles__article${i}--body`}
                          >
                            {article.body}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <ChipList>
                            {article.tags?.map((tag, j) => (
                              <ChipListItem
                                key={`${section}__article${i}--tag${j}`}
                                data-testid={`articles__article${i}--tag${j}`}
                              >
                                <Chip label={tag} size="small" sx={{ borderRadius: 1, mb: 0.5 }} />
                              </ChipListItem>
                            ))}
                          </ChipList>
                        </CardActions>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </SectionFadeIn>
          ) : (
            <Grid container spacing={4} sx={{ mt: 2 }}>
              {articleIds.map((_, i) => (
                <Grid item key={`${section}__loading${i}`} xs={12} sm={6} md={4}>
                  <Card sx={{ p: 1 }}>
                    <Skeleton animation="wave" variant="rectangular" sx={{ height: '180px' }} />
                    <CardContent>
                      {[...Array(2).keys()].reverse().map((n) => (
                        <Skeleton
                          key={`${section}__article${i}--dummytitle${n}`}
                          animation="wave"
                          variant="text"
                          sx={{ height: 20, ...(n ? { width: '100%' } : { mt: 1, mb: 0.5, width: '80%' }) }}
                          data-testid={`articles__article${i}--dummytitle${n}`}
                        />
                      ))}
                      {[...Array(4).keys()].reverse().map((n) => (
                        <Skeleton
                          key={`${section}__article${i}--dummybody${n}`}
                          animation="wave"
                          variant="text"
                          sx={{ height: 10, mt: 1.5, width: n ? '100%' : '80%' }}
                          data-testid={`articles__article${i}--dummybody${n}`}
                        />
                      ))}
                    </CardContent>
                    <CardActions>
                      {[...Array(2)].map((_, j) => (
                        <Skeleton
                          key={`${section}__article${i}--dummytag${j}`}
                          animation="wave"
                          variant="rectangular"
                          sx={{ height: 20, width: '15%' }}
                          data-testid={`articles__article${i}--dummytag${j}`}
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
