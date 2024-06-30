import express from 'express';

import {
  articlesMetadata,
  articlesPickup,
  careerDetails,
  careers,
  certifications,
  icons,
  productImages,
  products,
  sns,
  version,
} from '../api';

const router = express.Router();
router.get('/:sheetId/values/icons', icons);
router.get('/:sheetId/values/products', products);
router.get('/:sheetId/values/product-images', productImages);
router.get('/:sheetId/values/careers', careers);
router.get('/:sheetId/values/career-details', careerDetails);
router.get('/:sheetId/values/certifications', certifications);
router.get('/:sheetId/values/sns', sns);
router.get('/:sheetId/values/articles-metadata', articlesMetadata);
router.get('/:sheetId/values/articles-pickup', articlesPickup);
router.get('/:sheetId/values/version', version);

export const spreadsheetsRouter = router;
