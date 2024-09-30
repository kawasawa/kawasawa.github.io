import { Request, Response } from 'express';

import { observeError } from '../errors';

export const index = observeError(async (req: Request, res: Response) => {
  res.status(200).json({ success: true });
});
