import Boom from '@hapi/boom';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export const articlesMetadata = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = new PrismaClient();
    const records = await prisma.articles_metadata.findMany();
    if (!records?.length) {
      next(Boom.notFound());
      return;
    }

    const values = [
      [
        'id',
        'title',
        'body',
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
        value.title,
        value.body,
        value.tags,
        value.url,
        value.likes_count,
        value.stocks_count,
        value.comments_count,
        `${new Date(value.created_at.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)}+09:00`,
        `${new Date(value.updated_at.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 19)}+09:00`,
      ]),
    ];
    res.status(200).json({ range: "'articles-metadata'!A1:Z1000", majorDimension: 'ROWS', values: values });
  } catch (e) {
    next(e);
  }
};

export const articlesPickup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = new PrismaClient();
    const records = await prisma.articles_pickup.findMany();
    if (!records?.length) {
      next(Boom.notFound());
      return;
    }

    const values = [['id', 'data'], ...records.map((value) => [value.id, value.data])];
    res.status(200).json({ range: "'articles-pickup'!A1:Z1000", majorDimension: 'ROWS', values: values });
  } catch (e) {
    next(e);
  }
};

export const version = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = new PrismaClient();
    const records = await prisma.version.findMany();
    if (!records?.length) {
      next(Boom.notFound());
      return;
    }

    const values = [['last_update'], ...records.map((value) => [value.last_update])];
    res.status(200).json({ range: 'version!A1:Z1000', majorDimension: 'ROWS', values: values });
  } catch (e) {
    next(e);
  }
};
