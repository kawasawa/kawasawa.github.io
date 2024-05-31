import { Request, Response } from 'express';

import { withErrorHandler } from '../errors';
import { ApiSuccessResponse } from '../responses';

export const index = withErrorHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true } as ApiSuccessResponse);
});
