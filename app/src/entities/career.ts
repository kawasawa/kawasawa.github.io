import { sources } from '@/assets';

export type Career = Readonly<{
  id: string;
  date: string;
  place: string;
  favicon?: string;
  url?: string;
  skills: string[];
}>;

export const career: Career[] = [
  {
    id: 'college',
    date: '2014-03',
    place: 'Yamanashi',
    favicon: 'https://www.yamanashi.ac.jp/favicon.ico',
    url: 'https://www.yamanashi.ac.jp/',
    skills: [
      sources.cpp,
      sources.csharp,
      sources.dotnetfw,
      sources.mono,
      sources.gtkmm,
      sources.opengl,
      sources.emacs,
      sources.xampp,
    ],
  },
  {
    id: 'ysk',
    date: '2014-04',
    place: 'Yamanashi',
    favicon: 'https://www.ysk.co.jp/favicon.ico',
    url: 'https://www.ysk.co.jp/',
    skills: [
      sources.csharp,
      sources.vb,
      sources.dotnetcore,
      sources.wpf,
      sources.prism,
      sources.livet,
      sources.javascript,
      sources.jquery,
      sources.php,
      sources.laravel,
      sources.docker,
      sources.git,
      sources.svn,
    ],
  },
  {
    id: 'compmind',
    date: '2020-04',
    place: 'Yamanashi',
    favicon: 'https://www.compmind.co.jp/favicon.ico',
    url: 'https://www.compmind.co.jp/',
    skills: [sources.c, sources.vba, sources.svn, sources.redmine],
  },
  {
    id: 'jcb',
    date: '2020-11',
    place: 'Tokyo',
    favicon: 'https://www.jcb.co.jp/images/favicon.ico',
    url: 'https://www.jcb.co.jp/',
    skills: [
      sources.typescript,
      sources.reactjs,
      sources.expressjs,
      sources.python,
      sources.go,
      sources.docker,
      sources.swagger,
      sources.newman,
      sources.gitlab,
      sources.jira,
      sources.metabase,
      sources.datadog,
      sources.pagerduty,
      sources.gcp,
      sources.gcpgke,
    ],
  },
  {
    id: 'freelance',
    date: '2023-06',
    place: 'Tokyo',
    skills: [
      sources.typescript,
      sources.mui,
      sources.nextjs,
      sources.docker,
      sources.github,
      sources.aws,
      sources.awsecs,
      sources.awsfargate,
    ],
  },
];
