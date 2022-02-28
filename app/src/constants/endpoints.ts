/* istanbul ignore file */

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
  getIconBadge: 'https://img.shields.io/badge/',
  getFavicon: 'https://favicongrabber.com/api/grab/',
  getArticlesMetadata: `${process.env.REACT_APP_GOOGLEAPIS_URL}/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/articles-metadata?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
  getArticlesPickup: `${process.env.REACT_APP_GOOGLEAPIS_URL}/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/articles-pickup?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`,
} as const;
