import Boom from '@hapi/boom';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config';
import { spreadsheetsRouter } from './routes';

export const createApp = () => {
  const app = express();

  // ログ出力
  app.use(morgan('combined'));
  // Cookieパーサ
  app.use(cookieParser());
  // JSONパーサ
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // セキュリティヘッダー付与
  app.use(helmet());
  // セッション対応
  app.use(session(config.session));
  // CORS対応
  app.use(cors(config.cors));
  // SSL対応
  app.all('*', (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      next();
      return;
    }
    req.headers['x-forwarded-proto'] === 'http' ? res.redirect(`https://${req.headers.host}${req.url}`) : next();
  });

  // ルーティング
  const csrfProtection = csrf(config.csrf);
  app.use(`/spreadsheets`, csrfProtection, spreadsheetsRouter);

  // エラーハンドリング
  app.use((req, res, next) => next(Boom.notFound('Requested entity was not found.')));
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack ?? error);
    const statusCode = (error.isBoom ? error.output.statusCode : error.statusCode) ?? 500;
    const message = (error.isBoom ? error.output.payload.message : error.message) ?? 'exception occurred.';
    res.status(statusCode).json({ error: { code: statusCode, message: message } });
  });

  return app;
};
