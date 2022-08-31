import { useEffect, useState } from 'react';

import { createInstance } from '../api/axios';
import { GoogleSheetsApiResponse } from '../api/responses';
import { constants } from '../constants';
import { articles } from '../models';
import { handleError } from '../utils/errors';

export type ArticleData = {
  title?: string;
  body?: string;
  url?: string;
  tags?: string[];
  likesCount?: number;
  image?: string;
};

const getArticles = async () => {
  const client = createInstance();
  const metadataResponse = await client.get<GoogleSheetsApiResponse>(constants.url.getArticlesMetadata);
  const thumbnailResponse = await client.get<GoogleSheetsApiResponse>(constants.url.getArticlesThumbnail);

  const metadataHeader = metadataResponse.data.values[0];
  const i_id = metadataHeader.indexOf('id');
  const i_title = metadataHeader.indexOf('title');
  const i_body = metadataHeader.indexOf('body');
  const i_tags = metadataHeader.indexOf('tags');
  const i_url = metadataHeader.indexOf('url');
  const i_likesCount = metadataHeader.indexOf('likes_count');
  const thumbnailHeader = thumbnailResponse.data.values[0];
  const j_id = thumbnailHeader.indexOf('id');
  const j_data = thumbnailHeader.indexOf('data');

  const buffer: { [key: string]: ArticleData } = {};
  articles.forEach((a) => (buffer[a.id] = {}));
  metadataResponse.data.values.forEach((row) => {
    const id = row[i_id];
    if (!Object.keys(buffer).includes(id)) return;
    buffer[id].title = row[i_title];
    buffer[id].body = row[i_body];
    buffer[id].url = row[i_url];
    buffer[id].tags = row[i_tags].split(',').map((t) => t.trim());
    buffer[id].likesCount = Number(row[i_likesCount]);
  });
  thumbnailResponse.data.values.forEach((row) => {
    const id = row[j_id];
    if (!Object.keys(buffer).includes(id)) return;
    buffer[id].image = row[j_data];
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
      } catch (err) {
        handleError(err);
      }
    };

    if (!ready || buffer) return;
    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return buffer;
};
