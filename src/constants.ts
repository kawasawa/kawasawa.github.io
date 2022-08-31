/* istanbul ignore file */

export const constants = {
  meta: {
    title: '@kawasawa',
    author: 'Kazuki Awasawa',
    authorJob: 'Software Engineer',
    copyright: `© Kazuki Awasawa All Rights Reserved.`,
  },
  sections: {
    products: 'PRODUCTS',
    articles: 'ARTICLES',
    about: 'ABOUT',
  },
  style: {
    inViewOptions: { rootMargin: '-100px' },
    zoomOnHover: { transition: 'all 0.2s ease', '&:hover': { transform: 'scale(1.05, 1.05)' } },
  },
  url: {
    self: 'https://kawasawa.github.io',
    repository: 'https://github.com/kawasawa/kawasawa.github.io',
    license: 'https://github.com/kawasawa/kawasawa.github.io/blob/master/LICENSE',
    readme: 'https://github.com/kawasawa/kawasawa.github.io/blob/master/README.md#kawasawa',
    codecov: 'https://codecov.io/github/kawasawa/kawasawa.github.io',
    codecovBadge:
      'https://codecov.io/github/kawasawa/kawasawa.github.io/branch/master/graph/badge.svg?token=eQFuC9Qyum',
    licenseBadge: 'https://img.shields.io/github/license/kawasawa/kawasawa.github.io.svg',
    getIconBadge: 'https://img.shields.io/badge/',
    getFavicon: 'https://favicongrabber.com/api/grab/',
    getArticlesMetadata: `https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/articles-metadata?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
    getArticlesThumbnail: `https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/articles-thumbnail?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
  },
};
