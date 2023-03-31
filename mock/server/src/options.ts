import { CorsOptions } from 'cors';
import csurf from 'csurf';
import { SessionOptions } from 'express-session';

type CsrfOptions = {
  cookie?: csurf.CookieOptions | boolean | undefined;
  ignoreMethods?: string[] | undefined;
  sessionKey?: string | undefined;
};

const cookieOptions: csurf.CookieOptions = {
  maxAge: 600,
  httpOnly: true,
  secure: true,
  sameSite: false,
} as const;

export const options = {
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
