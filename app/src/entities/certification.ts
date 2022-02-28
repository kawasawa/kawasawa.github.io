export type Certification = Readonly<{
  id: string;
  date: string;
  url: string;
  favicon: string;
}>;

// favicon の確認方法
// $ curl -X GET "http://favicongrabber.com/api/grab/<URL:ホスト名以下>"
export const certification: Certification[] = [
  {
    id: 'FE',
    date: '2012-05',
    url: 'https://www.ipa.go.jp/shiken/kubun/fe.html',
    favicon: 'https://www.ipa.go.jp/favicon.ico',
  },
  {
    id: 'AP',
    date: '2014-12',
    url: 'https://www.ipa.go.jp/shiken/kubun/ap.html',
    favicon: 'https://www.ipa.go.jp/favicon.ico',
  },
  {
    id: 'FP3',
    date: '2020-03',
    url: 'https://www.jafp.or.jp/exam/about/',
    favicon: 'https://www.jafp.or.jp/shared/img/favicon.ico',
  },
  {
    id: 'NB3',
    date: '2021-05',
    url: 'https://www.kentei.ne.jp/bookkeeping/class3',
    favicon: 'https://www.kentei.ne.jp/wp/wp-content/themes/kentei/favicon.ico',
  },
  {
    id: 'PD',
    date: '2022-10',
    url: 'https://www.j-credit.or.jp/license/license/personal_data.html',
    favicon: 'https://www.j-credit.or.jp/favicon.ico',
  },
];
