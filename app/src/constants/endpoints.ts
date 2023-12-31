/* istanbul ignore file */

const DIR_SPREADSHEETS = `spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}`;
const QUERY_KEY = `key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`;
export const endpoints = {
  getIcons: `${DIR_SPREADSHEETS}/values/icons?${QUERY_KEY}`,
  getProducts: `${DIR_SPREADSHEETS}/values/products?${QUERY_KEY}`,
  getProductImages: `${DIR_SPREADSHEETS}/values/product-images?${QUERY_KEY}`,
  getCareers: `${DIR_SPREADSHEETS}/values/careers?${QUERY_KEY}`,
  getCareerDetails: `${DIR_SPREADSHEETS}/values/career-details?${QUERY_KEY}`,
  getCertifications: `${DIR_SPREADSHEETS}/values/certifications?${QUERY_KEY}`,
  getSns: `${DIR_SPREADSHEETS}/values/sns?${QUERY_KEY}`,
  getArticlesMetadata: `${DIR_SPREADSHEETS}/values/articles-metadata?${QUERY_KEY}`,
  getArticlesPickup: `${DIR_SPREADSHEETS}/values/articles-pickup?${QUERY_KEY}`,
} as const;
