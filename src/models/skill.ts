import {
  Business as BusinessIcon,
  Language as LanguageIcon,
  Lightbulb as LightbulbIcon,
  Window as WindowIcon,
} from '@mui/icons-material';
import { SvgIcon } from '@mui/material';

import { sources } from '../assets';

type Skill = Readonly<{
  name: string;
  icon: typeof SvgIcon;
  tags: string[];
  hidden?: boolean;
}>;

export const skill: Skill[] = [
  {
    name: 'Windows Apps',
    icon: WindowIcon,
    tags: [
      sources.csharp,
      sources.dotnetcore,
      sources.dotnetfw,
      sources.wpf,
      sources.prism,
      sources.livet,
      sources.mahapps,
      sources.win32,
    ],
  },
  {
    name: 'Web Apps',
    icon: LanguageIcon,
    tags: [
      sources.typescript,
      sources.react,
      sources.mui,
      sources.javascript,
      sources.jquery,
      sources.nodejs,
      sources.php,
      sources.laravel,
    ],
  },
  {
    name: 'Platforms',
    icon: BusinessIcon,
    tags: [
      sources.vscode,
      sources.docker,
      sources.swagger,
      sources.postman,
      sources.gitlab,
      sources.jira,
      sources.metabase,
      sources.gas,
    ],
  },
  {
    name: 'a little...',
    icon: LightbulbIcon,
    tags: [
      sources.go,
      sources.python,
      sources.java,
      sources.cpp,
      sources.vb,
      sources.vba,
      sources.sqlserver,
      sources.mysql,
      sources.sqlite,
      sources.redis,
      sources.nginx,
      sources.apache,
      sources.heroku,
      sources.firebase,
      sources.gcp,
      sources.kubernetes,
      sources.terraform,
      sources.datadog,
      sources.pagerduty,
    ],
    hidden: true,
  },
];
