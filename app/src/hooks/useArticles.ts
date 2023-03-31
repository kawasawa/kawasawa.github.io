import { useEffect, useState } from 'react';

import { createInstance, GoogleSheetsApiResponse } from '@/api';
import { endpoints } from '@/constants';
import { handleError } from '@/utils/errors';

export type ArticleData = {
  title?: string;
  body?: string;
  url?: string;
  tags?: string[];
  likesCount?: number;
  stocksCount?: number;
  commentsCount?: number;
  image?: string;
};

const getArticles = async () => {
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
  const metadata_title = metadataHeader.indexOf('title');
  const metadata_body = metadataHeader.indexOf('body');
  const metadata_tags = metadataHeader.indexOf('tags');
  const metadata_url = metadataHeader.indexOf('url');
  const metadata_likesCount = metadataHeader.indexOf('likes_count');
  const metadata_stocksCount = metadataHeader.indexOf('stocks_count');
  const metadata_commentsCount = metadataHeader.indexOf('comments_count');

  metadataResponse.data.values.forEach((row) => {
    const id = row[metadata_id];
    if (!Object.keys(buffer).includes(id)) return;
    buffer[id].title = row[metadata_title];
    buffer[id].body = row[metadata_body];
    buffer[id].url = row[metadata_url];
    buffer[id].tags = row[metadata_tags].split(',').map((t) => t.trim());
    buffer[id].likesCount = Number(row[metadata_likesCount]);
    buffer[id].stocksCount = Number(row[metadata_stocksCount]);
    buffer[id].commentsCount = Number(row[metadata_commentsCount]);
  });
  return buffer;
};

export const useArticles = (ready: boolean) => {
  const [buffer, setBuffer] = useState<{ [key: string]: ArticleData }>();

  useEffect(() => {
    const func = async () => {
      try {
        const tmp = await getArticles();
        setBuffer(tmp);
      } catch (e) {
        handleError(e);
      }
    };

    if (!ready || buffer) return;
    func();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [ready]);

  return buffer;
};
