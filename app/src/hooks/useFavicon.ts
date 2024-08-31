import { useEffect, useState } from 'react';

import { FaviconGrabberApiResponse, getApiClient } from '@/api';
import { endpoints } from '@/constants';
import { handleError } from '@/utils/errors';

/** @deprecated 破棄予定 */
/* istanbul ignore next */
const parseUrl = (url: string) => {
  // プロトコルを除去する
  const cleanedUrl = url.includes('https') ? url.slice(8) : url.includes('http') ? url.slice(7) : url;
  // ドメイン名のみ抽出する
  return cleanedUrl.includes('/') ? cleanedUrl.split('/')[0] : cleanedUrl;
};

/** @deprecated 破棄予定 */
/* istanbul ignore next */
const getFavicon = async (urls: string[]) => {
  const client = getApiClient();
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
/* istanbul ignore next */
export const useFavicon = (ready: boolean, urls: string[]) => {
  const [buffer, setBuffer] = useState<(string | undefined)[]>();

  useEffect(() => {
    const func = async () => {
      try {
        const tmp = await getFavicon(urls);
        setBuffer(tmp);
      } catch (e) {
        handleError(e);
      }
    };

    if (!ready || buffer) return;
    func();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [ready, urls]);

  return buffer;
};
