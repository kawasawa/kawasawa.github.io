import { NextFunction, Request, Response } from 'express';

export const sslFilter = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production') {
    next();
    return;
  }
  if (req.protocol !== 'http') {
    next();
    return;
  }

  res.redirect(301, `https://${req.header('host')}${req.originalUrl}`);
};
