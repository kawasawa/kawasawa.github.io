import { Request, Response } from 'express';

export const index = async (req: Request, res: Response) => {
  res.status(200).json({ success: true });
};
