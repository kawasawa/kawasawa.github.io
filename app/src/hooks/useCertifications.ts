import React from 'react';

import { endpoints } from '@/constants';
import { createInstance, GoogleSheetsApiResponse } from '@/lib';
import { handleError } from '@/utils/errors';

export type CertificationData = {
  id: number;
  date: string;
  'title_ja-JP': string;
  'title_en-US': string;
  'subject_ja-JP': string;
  'subject_en-US': string;
  favicon: string;
  url: string;
  visible: boolean;
};

const fetchData = async () => {
  const client = createInstance();
  const [certificationsResponse] = await Promise.all([
    client.get<GoogleSheetsApiResponse>(endpoints.getCertifications),
  ]);

  const certification = certificationsResponse.data.values[0];
  const certification_id = certification.indexOf('id');
  const certification_date = certification.indexOf('date');
  const certification_titleJaJp = certification.indexOf('title_ja-JP');
  const certification_titleEnUs = certification.indexOf('title_en-US');
  const certification_subjectJaJp = certification.indexOf('subject_ja-JP');
  const certification_subjectEnUs = certification.indexOf('subject_en-US');
  const certification_favicon = certification.indexOf('favicon');
  const certification_url = certification.indexOf('url');
  const certification_visible = certification.indexOf('visible');

  const buffer = certificationsResponse.data.values.slice(1, certificationsResponse.data.values.length).map(
    (row) =>
      ({
        id: Number(row[certification_id]),
        date: row[certification_date],
        'title_ja-JP': row[certification_titleJaJp],
        'title_en-US': row[certification_titleEnUs],
        'subject_ja-JP': row[certification_subjectJaJp],
        'subject_en-US': row[certification_subjectEnUs],
        favicon: row[certification_favicon],
        url: row[certification_url],
        visible: row[certification_visible]?.toLowerCase() === 'true' ? true : false,
      } as CertificationData)
  );
  return buffer;
};

export const useCertifications = (ready: boolean) => {
  const [cache, setCache] = React.useState<CertificationData[]>();

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
