import { Request, Response } from 'express';

import { ApiSuccessResponse } from '../responses';

export const index = async (req: Request, res: Response) => {
  res.status(200).json({ success: true } as ApiSuccessResponse);
};
