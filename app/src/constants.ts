/* istanbul ignore file */

export const meta = {
  title: '@kawasawa',
  author: 'Kazuki Awasawa',
  authorJob: 'Software Engineer',
  copyright: `© Kazuki Awasawa All Rights Reserved.`,
} as const;

export const sections = {
  products: 'PRODUCTS',
  articles: 'ARTICLES',
  about: 'ABOUT',
} as const;

export const values = {
  ARTICLES_LIKES_COUNT_THRESHOLD: 10,
  ARTICLES_LIKES_COUNT_POPULAR: 100,
  skeltonCount: {
    articles: 3,
    products: 3,
    about: {
      career: 5,
      certification: 5,
    },
  },
} as const;

export const styles = {
  inViewOptions: { rootMargin: '-100px' },
  zoomOnHover: { transition: 'all 0.2s ease', '&:hover': { transform: 'scale(1.05)' } },
} as const;

export const endpoints = {
  self: 'https://kawasawa.github.io',
  repository: 'https://github.com/kawasawa/kawasawa.github.io',
  readme: 'https://github.com/kawasawa/kawasawa.github.io/blob/master/README.md',
  githubBadge: 'https://github.com/kawasawa/kawasawa.github.io/workflows/.github/workflows/ci.yml/badge.svg',
  codecovBadge: 'https://codecov.io/github/kawasawa/kawasawa.github.io/badge.svg',
  fossaBadge:
    'https://app.fossa.com/api/projects/custom%2B34428%2Fgithub.com%2Fkawasawa%2Fkawasawa.github.io.svg?type=shield',
  snykBadge: 'https://snyk.io/test/github/kawasawa/kawasawa.github.io/badge.svg',
  licenseBadge: 'https://img.shields.io/github/license/kawasawa/kawasawa.github.io.svg',
  getFavicon: 'https://favicongrabber.com/api/grab/',
  getIcons: `${process.env.REACT_APP_GOOGLEAPIS_URL}/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/icons?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
  getProducts: `${process.env.REACT_APP_GOOGLEAPIS_URL}/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/products?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
  getProductImages: `${process.env.REACT_APP_GOOGLEAPIS_URL}/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/product-images?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
  getCareers: `${process.env.REACT_APP_GOOGLEAPIS_URL}/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/careers?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
  getCareerDetails: `${process.env.REACT_APP_GOOGLEAPIS_URL}/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/career-details?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
  getCertifications: `${process.env.REACT_APP_GOOGLEAPIS_URL}/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/certifications?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
  getArticlesMetadata: `${process.env.REACT_APP_GOOGLEAPIS_URL}/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/articles-metadata?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
  getArticlesPickup: `${process.env.REACT_APP_GOOGLEAPIS_URL}/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/articles-pickup?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
} as const;
