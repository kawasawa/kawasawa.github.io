import React from 'react';

import { endpoints } from '@/constants';
import { createInstance, GoogleSheetsApiResponse } from '@/lib';
import { handleError } from '@/utils/errors';

export type ArticleData = {
  'title_ja-JP'?: string;
  'title_en-US'?: string;
  'body_ja-JP'?: string;
  'body_en-US'?: string;
  url?: string;
  tags?: string[];
  likesCount?: number;
  stocksCount?: number;
  commentsCount?: number;
  image?: string;
};

const fetchData = async () => {
  const client = createInstance();
  const [pickupResponse, metadataResponse] = await Promise.all([
    client.get<GoogleSheetsApiResponse>(endpoints.getArticlesPickup),
    client.get<GoogleSheetsApiResponse>(endpoints.getArticlesMetadata),
  ]);

  const pickupHeader = pickupResponse.data.values[0];
  const pickup_id = pickupHeader.indexOf('id');
  const pickup_data = pickupHeader.indexOf('data');

  const buffer: { [key: string]: ArticleData } = {};
  pickupResponse.data.values.slice(1).forEach((row) => (buffer[row[pickup_id]] = { image: row[pickup_data] }));

  const metadataHeader = metadataResponse.data.values[0];
  const metadata_id = metadataHeader.indexOf('id');
  const metadata_titleJaJp = metadataHeader.indexOf('title_ja-JP');
  const metadata_titleEnUs = metadataHeader.indexOf('title_en-US');
  const metadata_bodyJaJp = metadataHeader.indexOf('body_ja-JP');
  const metadata_bodyEnUs = metadataHeader.indexOf('body_en-US');
  const metadata_tags = metadataHeader.indexOf('tags');
  const metadata_url = metadataHeader.indexOf('url');
  const metadata_likesCount = metadataHeader.indexOf('likes_count');
  const metadata_stocksCount = metadataHeader.indexOf('stocks_count');
  const metadata_commentsCount = metadataHeader.indexOf('comments_count');

  metadataResponse.data.values.forEach((row) => {
    const id = row[metadata_id];
    if (!Object.keys(buffer).includes(id)) return;
    buffer[id]['title_ja-JP'] = row[metadata_titleJaJp];
    buffer[id]['title_en-US'] = row[metadata_titleEnUs];
    buffer[id]['body_ja-JP'] = row[metadata_bodyJaJp];
    buffer[id]['body_en-US'] = row[metadata_bodyEnUs];
    buffer[id].url = row[metadata_url];
    buffer[id].tags = row[metadata_tags].split(',').map((t) => t.trim());
    buffer[id].likesCount = Number(row[metadata_likesCount]);
    buffer[id].stocksCount = Number(row[metadata_stocksCount]);
    buffer[id].commentsCount = Number(row[metadata_commentsCount]);
  });
  return buffer;
};

export const useArticles = (ready: boolean) => {
  const [cache, setCache] = React.useState<{ [key: string]: ArticleData }>();

  React.useEffect(() => {
    if (ready && !cache)
      (async () => {
        try {
          const data = await fetchData();
          setCache(data);
        } catch (e) {
          handleError(e);
        }
      })();
  }, [ready, cache]);

  return cache;
};
