import express from 'express';

import { index } from '../api';

const router = express.Router();
router.get('/', index);

export const healthRouter = router;
