import boom from '@hapi/boom';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import { convertToBoomInstance } from './errors';
import { ApiErrorResponse } from './responses';
import { devRouter, healthRouter, spreadsheetsRouter } from './routes';

const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000',
}; //as const;

export const createApp = () => {
  const app = express();

  // ログ出力
  app.use(morgan('combined'));
  // CORS対応
  app.use(cors(corsOptions));
  // JSONパーサ
  app.use(express.json());
  // Bodyパーサ
  app.use(express.urlencoded({ extended: true }));

  // ヘルスチェック
  app.use('/health', healthRouter);

  // ルーティング
  app.use('/dev', devRouter);
  app.use('/spreadsheets', spreadsheetsRouter);

  // NotFound ハンドラ
  app.use((req, res, next) => next(boom.notFound('requested entity was not found.')));

  // グローバルエラーハンドラ
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const b = convertToBoomInstance(err);
    const body = {
      error: {
        code: b.output.payload.statusCode,
        message: b.output.payload.message,
        status: b.output.payload.error,
      },
    } as ApiErrorResponse;
    res.status(b.output.statusCode).json(body);
  });

  return app;
};
