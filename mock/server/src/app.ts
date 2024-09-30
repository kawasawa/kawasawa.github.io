import Boom from '@hapi/boom';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { CorsOptions } from 'cors';
import csrf from 'csurf';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import { SessionOptions } from 'express-session';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { error, logger, options as loggerOptions } from './logger';
import { sslFilter } from './middlewares';
import { healthRouter, spreadsheetsRouter } from './routes';

type CsrfOptions = {
  cookie?: csrf.CookieOptions | boolean | undefined;
  ignoreMethods?: string[] | undefined;
  sessionKey?: string | undefined;
};

const cookieOptions: csrf.CookieOptions = {
  maxAge: 600,
  httpOnly: true,
  secure: true,
  sameSite: false,
} as const;

const options = {
  session: {
    secret: 'secret',
    cookie: cookieOptions,
    resave: false,
    rolling: true,
    saveUninitialized: false,
  } as SessionOptions,
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://kawasawa.github.io/' : '*',
    credentials: true,
    methods: 'GET,POST,PATCH,DELETE',
  } as CorsOptions,
  csrf: {
    cookie: cookieOptions,
  } as CsrfOptions,
} as const;

export const createApp = () => {
  const app = express();

  // ログ出力
  app.use(pinoHttp({ ...loggerOptions.pinoHttp, logger }));
  // Cookieパーサ
  app.use(cookieParser());
  // JSONパーサ
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // セキュリティヘッダー付与
  app.use(helmet());
  // セッション対応
  app.use(session(options.session));
  // CORS対応
  app.use(cors(options.cors));
  // SSL対応
  app.all('*', sslFilter);

  // ルーティング
  const csrfFilter = csrf(options.csrf);
  app.use('/health', healthRouter);
  app.use('/spreadsheets', csrfFilter, spreadsheetsRouter);

  // エラーハンドリング
  app.use((req, res, next) => next(Boom.notFound('requested entity was not found.')));
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const e = Boom.isBoom(err) ? err : Boom.boomify(err, { statusCode: Boom.internal().output.statusCode });
    const statusCode = e.output.statusCode;
    const message = `${e.output.payload.error}: ${e.message}`;
    error(req, message, e);
    res.status(statusCode).json({ error: { code: statusCode, message: message } });
  });

  return app;
};
