import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { withErrorHandler } from '../errors';
import { getDbClient } from '../lib';
import { GoogleSheetsApiResponse } from '../responses';

export const icons = withErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getDbClient();
  const records = await prisma.icons.findMany();
  if (!records?.length) {
    next(boom.notFound());
    return;
  }

  const values = [['id', 'data'], ...records.map((value) => [value.id, value.data])];
  res
    .status(200)
    .json({ range: "'icons'!A1:Z1000", majorDimension: 'ROWS', values: values } as GoogleSheetsApiResponse);
});

export const products = withErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getDbClient();
  const records = await prisma.products.findMany();
  if (!records?.length) {
    next(boom.notFound());
    return;
  }

  const values = [
    [
      'id',
      'title_ja-JP',
      'title_en-US',
      'subject_ja-JP',
      'subject_en-US',
      'body_ja-JP',
      'body_en-US',
      'skills',
      'url_code',
      'url_home',
      'downloads',
      'pickup',
      'visible',
    ],
    ...records.map((value) => [
      value.id,
      value.title_ja_jp,
      value.title_en_us,
      value.subject_ja_jp,
      value.subject_en_us,
      value.body_ja_jp,
      value.body_en_us,
      value.skills,
      value.url_code,
      value.url_home,
      value.downloads,
      value.pickup ? 'true' : 'false',
      value.visible ? 'true' : 'false',
    ]),
  ];
  res
    .status(200)
    .json({ range: "'products'!A1:Z1000", majorDimension: 'ROWS', values: values } as GoogleSheetsApiResponse);
});

export const productImages = withErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getDbClient();
  const records = await prisma.product_images.findMany();
  if (!records?.length) {
    next(boom.notFound());
    return;
  }

  const values = [
    ['product_id', 'row_no', 'data'],
    ...records.map((value) => [value.product_id, value.row_no, value.data]),
  ];
  res
    .status(200)
    .json({ range: "'product-images'!A1:Z1000", majorDimension: 'ROWS', values: values } as GoogleSheetsApiResponse);
});

export const careers = withErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getDbClient();
  const records = await prisma.careers.findMany();
  if (!records?.length) {
    next(boom.notFound());
    return;
  }

  const values = [
    ['id', 'date', 'place', 'title_ja-JP', 'title_en-US', 'favicon', 'url', 'visible'],
    ...records.map((value) => [
      value.id,
      value.date,
      value.place,
      value.title_ja_jp,
      value.title_en_us,
      value.favicon,
      value.url,
      value.visible ? 'true' : 'false',
    ]),
  ];
  res
    .status(200)
    .json({ range: "'careers'!A1:Z1000", majorDimension: 'ROWS', values: values } as GoogleSheetsApiResponse);
});

export const careerDetails = withErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getDbClient();
  const records = await prisma.career_details.findMany();
  if (!records?.length) {
    next(boom.notFound());
    return;
  }

  const values = [
    ['career_id', 'row_no', 'subject_ja-JP', 'subject_en-US', 'skills'],
    ...records.map((value) => [value.career_id, value.row_no, value.subject_ja_jp, value.subject_en_us, value.skills]),
  ];
  res
    .status(200)
    .json({ range: "'career-details'!A1:Z1000", majorDimension: 'ROWS', values: values } as GoogleSheetsApiResponse);
});

export const certifications = withErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getDbClient();
  const records = await prisma.certifications.findMany();
  if (!records?.length) {
    next(boom.notFound());
    return;
  }

  const values = [
    ['id', 'date', 'title_ja-JP', 'title_en-US', 'subject_ja-JP', 'subject_en-US', 'favicon', 'url', 'visible'],
    ...records.map((value) => [
      value.id,
      value.date,
      value.title_ja_jp,
      value.title_en_us,
      value.subject_ja_jp,
      value.subject_en_us,
      value.favicon,
      value.url,
      value.visible ? 'true' : 'false',
    ]),
  ];
  res
    .status(200)
    .json({ range: "'certifications'!A1:Z1000", majorDimension: 'ROWS', values: values } as GoogleSheetsApiResponse);
});

export const sns = withErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getDbClient();
  const records = await prisma.sns.findMany();
  if (!records?.length) {
    next(boom.notFound());
    return;
  }

  const values = [
    ['id', 'title_ja-JP', 'title_en-US', 'favicon', 'url', 'visible'],
    ...records.map((value) => [
      value.id,
      value.title_ja_jp,
      value.title_en_us,
      value.favicon,
      value.url,
      value.visible ? 'true' : 'false',
    ]),
  ];
  res.status(200).json({ range: "'sns'!A1:Z1000", majorDimension: 'ROWS', values: values } as GoogleSheetsApiResponse);
});

export const articlesMetadata = withErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getDbClient();
  const records = await prisma.articles_metadata.findMany();
  if (!records?.length) {
    next(boom.notFound());
    return;
  }

  const values = [
    [
      'id',
      'title_ja-JP',
      'title_en-US',
      'body_ja-JP',
      'body_en-US',
      'tags',
      'url',
      'likes_count',
      'stocks_count',
      'comments_count',
      'created_at',
      'updated_at',
    ],
    ...records.map((value) => [
      value.id,
      value.title_ja_jp,
      value.title_en_us,
      value.body_ja_jp,
      value.body_en_us,
      value.tags,
      value.url,
      value.likes_count,
      value.stocks_count,
      value.comments_count,
      `${new Date(value.created_at.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)}+09:00`,
      `${new Date(value.updated_at.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)}+09:00`,
    ]),
  ];
  res
    .status(200)
    .json({ range: "'articles-metadata'!A1:Z1000", majorDimension: 'ROWS', values: values } as GoogleSheetsApiResponse);
});

export const articlesPickup = withErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getDbClient();
  const records = await prisma.articles_pickup.findMany();
  if (!records?.length) {
    next(boom.notFound());
    return;
  }

  const values = [['id', 'data'], ...records.map((value) => [value.id, value.data])];
  res
    .status(200)
    .json({ range: "'articles-pickup'!A1:Z1000", majorDimension: 'ROWS', values: values } as GoogleSheetsApiResponse);
});

export const version = withErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const prisma = getDbClient();
  const records = await prisma.version.findMany();
  if (!records?.length) {
    next(boom.notFound());
    return;
  }

  const values = [['last_update'], ...records.map((value) => [value.last_update])];
  res
    .status(200)
    .json({ range: 'version!A1:Z1000', majorDimension: 'ROWS', values: values } as GoogleSheetsApiResponse);
});
