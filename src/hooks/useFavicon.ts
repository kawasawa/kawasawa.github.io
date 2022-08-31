/* istanbul ignore file */

//
// 破棄予定
//

import { useEffect, useState } from 'react';

import { createInstance } from '../api/axios';
import { FaviconGrabberApiResponse } from '../api/responses';
import { constants } from '../constants';
import { handleError } from '../utils/errors';

/** @deprecated */
const parseUrl = (url: string) => {
  // プロトコルを除去する
  const cleanedUrl = url.includes('https') ? url.slice(8) : url.includes('http') ? url.slice(7) : url;
  // ドメイン名のみ抽出する
  return cleanedUrl.includes('/') ? cleanedUrl.split('/')[0] : cleanedUrl;
};

/** @deprecated */
const getFavicon = async (urls: string[]) => {
  const client = createInstance();
  const buffer: (string | undefined)[] = [];
  const responses = await Promise.all(
    urls.map(async (url, i) => {
      try {
        const parsedUrl = parseUrl(url);
        const response = await client.get<FaviconGrabberApiResponse>(`${constants.url.getFavicon}${parsedUrl}`);
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

/** @deprecated */
export const useFavicon = (ready: boolean, urls: string[]) => {
  const [buffer, setBuffer] = useState<(string | undefined)[]>();

  useEffect(() => {
    const func = async () => {
      try {
        const tmp = await getFavicon(urls);
        setBuffer(tmp);
      } catch (err) {
        handleError(err);
      }
    };

    if (!ready || buffer) return;
    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, urls]);

  return buffer;
};
