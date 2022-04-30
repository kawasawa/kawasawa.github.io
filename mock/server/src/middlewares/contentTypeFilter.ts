import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

export const contentTypeFilter =
  (allowType: string, ignoreMethods?: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (ignoreMethods && ignoreMethods.map((s) => s.toUpperCase()).includes(req.method.toUpperCase())) {
      next();
      return;
    }
    if (req.is(allowType)) {
      next();
      return;
    }

    next(boom.unsupportedMediaType(`only ${allowType} is supported.`));
  };
