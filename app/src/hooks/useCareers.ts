import React from 'react';

import { endpoints } from '@/constants';
import { createInstance, GoogleSheetsApiResponse } from '@/lib';
import { handleError } from '@/utils/errors';

export type CareerDetailData = {
  rowNo: number;
  'subject_ja-JP': string;
  'subject_en-US': string;
  skills: { key: string; icon: string }[];
};

export type CareerData = {
  id: number;
  date: string;
  place: string;
  'title_ja-JP': string;
  'title_en-US': string;
  favicon: string;
  url: string;
  visible: boolean;
  details: CareerDetailData[];
};

const fetchData = async () => {
  const client = createInstance();
  const [careersResponse, careerDetailsResponse, iconsResponse] = await Promise.all([
    client.get<GoogleSheetsApiResponse>(endpoints.getCareers),
    client.get<GoogleSheetsApiResponse>(endpoints.getCareerDetails),
    client.get<GoogleSheetsApiResponse>(endpoints.getIcons),
  ]);

  const career = careersResponse.data.values[0];
  const career_id = career.indexOf('id');
  const career_date = career.indexOf('date');
  const career_place = career.indexOf('place');
  const career_titleJaJp = career.indexOf('title_ja-JP');
  const career_titleEnUs = career.indexOf('title_en-US');
  const career_favicon = career.indexOf('favicon');
  const career_url = career.indexOf('url');
  const career_visible = career.indexOf('visible');

  const careerDetail = careerDetailsResponse.data.values[0];
  const careerDetail_careerId = careerDetail.indexOf('career_id');
  const careerDetail_rowNo = careerDetail.indexOf('row_no');
  const careerDetail_subjectJaJp = careerDetail.indexOf('subject_ja-JP');
  const careerDetail_subjectEnUs = careerDetail.indexOf('subject_en-US');
  const careerDetail_skills = careerDetail.indexOf('skills');

  const icon = iconsResponse.data.values[0];
  const icon_id = icon.indexOf('id');
  const icon_data = icon.indexOf('data');

  const buffer = careersResponse.data.values.slice(1, careersResponse.data.values.length).map(
    (row) =>
      ({
        id: Number(row[career_id]),
        date: row[career_date],
        place: row[career_place],
        'title_ja-JP': row[career_titleJaJp],
        'title_en-US': row[career_titleEnUs],
        favicon: row[career_favicon],
        url: row[career_url],
        visible: row[career_visible]?.toLowerCase() === 'true' ? true : false,
        details: [],
      } as CareerData)
  );

  careerDetailsResponse.data.values.slice(1, careerDetailsResponse.data.values.length).forEach((row) => {
    const career = buffer.find((c) => c.id === Number(row[careerDetail_careerId]));
    if (!career) return;

    career.details[career.details.length] = {
      rowNo: Number(row[careerDetail_rowNo]),
      'subject_ja-JP': row[careerDetail_subjectJaJp],
      'subject_en-US': row[careerDetail_subjectEnUs],
      skills: row[careerDetail_skills]
        .split(',')
        .map((s) => s.trim())
        .map((s) => {
          const icon = iconsResponse.data.values.find((row) => row[icon_id] === s);
          return { key: s, icon: icon ? icon[icon_data] : '' };
        }),
    };
  });

  return buffer;
};

export const useCareers = (ready: boolean) => {
  const [cache, setCache] = React.useState<CareerData[]>();

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
