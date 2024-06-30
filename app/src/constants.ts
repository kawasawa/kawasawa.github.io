/* istanbul ignore file */

export const meta = {
  title: '@kawasawa',
  author: 'Kazuki Awasawa',
  copyright: `© Kazuki Awasawa All Rights Reserved.`,
} as const;

export const sections = {
  products: 'PRODUCTS',
  articles: 'ARTICLES',
  about: 'ABOUT',
} as const;

export const values = {
  likesCountThreshold: {
    visible: 10,
    popular: 100,
  },
  skeltonCount: {
    products: 3,
    articles: 3,
    about: {
      career: 5,
      certification: 5,
      sns: 4,
    },
  },
} as const;

export const styles = {
  intersectionOptions: { rootMargin: '-100px' },
  hoverOptions: { transition: 'all 0.2s ease', '&:hover': { transform: 'scale(1.05)' } },
} as const;

export const links = {
  self: 'https://kawasawa.github.io',
  repository: 'https://github.com/kawasawa/kawasawa.github.io',
  readme: 'https://github.com/kawasawa/kawasawa.github.io/blob/master/README.md',
  githubBadge: 'https://github.com/kawasawa/kawasawa.github.io/workflows/.github/workflows/ci.yml/badge.svg',
  codecovBadge: 'https://codecov.io/github/kawasawa/kawasawa.github.io/badge.svg',
  fossaBadge:
    'https://app.fossa.com/api/projects/custom%2B34428%2Fgithub.com%2Fkawasawa%2Fkawasawa.github.io.svg?type=shield',
  snykBadge: 'https://snyk.io/test/github/kawasawa/kawasawa.github.io/badge.svg',
  licenseBadge: 'https://img.shields.io/github/license/kawasawa/kawasawa.github.io.svg',
} as const;

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
