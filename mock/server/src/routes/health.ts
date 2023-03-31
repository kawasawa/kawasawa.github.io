import express from 'express';

import { boomError, error, index } from '../api';

const router = express.Router();
router.get('/', index);
router.get('/error', error);
router.get('/error/boom', boomError);

export const healthRouter = router;
