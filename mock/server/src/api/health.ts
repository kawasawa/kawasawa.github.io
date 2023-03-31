import Boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

export const index = async (req: Request, res: Response) => {
  res.status(200).json({ success: true });
};

export const error = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error('dummy error');
  } catch (e) {
    next(e);
  }
};

export const boomError = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw Boom.internal('dummy boom error');
  } catch (e) {
    next(e);
  }
};
