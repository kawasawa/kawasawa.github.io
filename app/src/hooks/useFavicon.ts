/* istanbul ignore file */

import React from 'react';

import { endpoints } from '@/constants';
import { createInstance, FaviconGrabberApiResponse } from '@/lib';
import { handleError } from '@/utils/errors';

const parseUrl = (url: string) => {
  // プロトコルを除去する
  const cleanedUrl = url.includes('https') ? url.slice(8) : url.includes('http') ? url.slice(7) : url;
  // ドメイン名のみ抽出する
  return cleanedUrl.includes('/') ? cleanedUrl.split('/')[0] : cleanedUrl;
};

const fetchData = async (urls: string[]) => {
  const client = createInstance();
  const buffer: (string | undefined)[] = [];
  const responses = await Promise.all(
    urls.map(async (url, i) => {
      try {
        const parsedUrl = parseUrl(url);
        const response = await client.get<FaviconGrabberApiResponse>(`${endpoints.getFavicon}${parsedUrl}`);
        return { i, src: response.data.icons[0].src };
      } catch (e) {
        console.error(`exception occurred while executing 'getFavicon': ${e}`);
        return { i, src: undefined };
      }
    })
  );
  buffer.push(...responses.sort((a, b) => a.i - b.i).map((obj) => obj.src));
  return buffer;
};

/** @deprecated 破棄予定 */
export const useFavicon = (ready: boolean, urls: string[]) => {
  const [cache, setCache] = React.useState<(string | undefined)[]>();

  React.useEffect(() => {
    if (ready && !cache)
      (async () => {
        try {
          const data = await fetchData(urls);
          setCache(data);
        } catch (e) {
          handleError(e);
        }
      })();
  }, [ready, urls, cache]);

  return cache;
};
