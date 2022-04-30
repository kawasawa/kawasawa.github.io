import express from 'express';

import { asyncError, boomError, csrfToken, error, send } from '../api';

const router = express.Router();
router.get('/error', error);
router.get('/error/boom', boomError);
router.get('/error/async', asyncError);
router.get('/csrf-token', csrfToken);
router.post('/send', send);

export const devRouter = router;
