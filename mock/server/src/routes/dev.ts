import express from 'express';

import { asyncError, boomError, error } from '../api';

const router = express.Router();
router.get('/error', error);
router.get('/error/boom', boomError);
router.get('/error/async', asyncError);

export const devRouter = router;
