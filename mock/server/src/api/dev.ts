import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

export const error = () => {
  throw new Error('dummy error');
};

export const boomError = () => {
  throw boom.internal('dummy boom error');
};

export const asyncError = async (req: Request, res: Response, next: NextFunction) => {
  // 非同期関数の例外は try-catch しないと捕捉できない
  try {
    throw new Error('dummy async error');
  } catch (e) {
    next(e);
  }
};
