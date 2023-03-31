import express from 'express';

import { articlesMetadata, articlesPickup, version } from '../api';

const router = express.Router();
router.get('/:sheetId/values/articles-metadata', articlesMetadata);
router.get('/:sheetId/values/articles-pickup', articlesPickup);
router.get('/:sheetId/values/version', version);

export const spreadsheetsRouter = router;
