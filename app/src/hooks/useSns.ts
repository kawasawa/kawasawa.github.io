import React from 'react';

import { endpoints } from '@/constants';
import { getApiClient, GoogleSheetsApiResponse } from '@/lib';
import { handleError } from '@/utils/errors';

export type Sns = {
  id: number;
  'title_ja-JP': string;
  'title_en-US': string;
  favicon: string;
  url: string;
  visible: boolean;
};

const fetchData = async () => {
  const client = getApiClient();
  const [snsResponse] = await Promise.all([client.get<GoogleSheetsApiResponse>(endpoints.getSns)]);

  const sns = snsResponse.data.values[0];
  const sns_id = sns.indexOf('id');
  const sns_titleJaJp = sns.indexOf('title_ja-JP');
  const sns_titleEnUs = sns.indexOf('title_en-US');
  const sns_favicon = sns.indexOf('favicon');
  const sns_url = sns.indexOf('url');
  const sns_visible = sns.indexOf('visible');

  const buffer = snsResponse.data.values.slice(1, snsResponse.data.values.length).map(
    (row) =>
      ({
        id: Number(row[sns_id]),
        'title_ja-JP': row[sns_titleJaJp],
        'title_en-US': row[sns_titleEnUs],
        favicon: row[sns_favicon],
        url: row[sns_url],
        visible: row[sns_visible]?.toLowerCase() === 'true' ? true : false,
      } as Sns)
  );
  return buffer;
};

export const useSns = (ready: boolean) => {
  const [cache, setCache] = React.useState<Sns[]>();

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
