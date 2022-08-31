export type Career = Readonly<{
  id: string;
  date: string;
  url: string;
  favicon: string;
  place: string;
}>;

export const career: Career[] = [
  {
    id: 'College',
    date: '2014-03',
    url: 'https://www.yamanashi.ac.jp/',
    favicon: 'https://www.yamanashi.ac.jp/favicon.ico',
    place: 'Yamanashi',
  },
  {
    id: 'YSK',
    date: '2014-04',
    url: 'https://www.ysk.co.jp/',
    favicon: 'http://www.ysk.co.jp/favicon.ico',
    place: 'Yamanashi',
  },
  {
    id: 'Compmind',
    date: '2020-04',
    url: 'https://www.compmind.co.jp/',
    favicon: 'https://www.compmind.co.jp/favicon.ico',
    place: 'Yamanashi',
  },
  {
    id: 'JCB',
    date: '2020-11',
    url: 'https://www.jcb.co.jp/',
    favicon: 'https://www.jcb.co.jp/images/favicon.ico',
    place: 'Tokyo',
  },
];
