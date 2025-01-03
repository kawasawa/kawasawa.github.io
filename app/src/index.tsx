/* istanbul ignore file */

import '@/index.css';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import i18n from 'i18next';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

import App from '@/App';
import enUsJson from '@/locales/en-US.json';
import jaJpJson from '@/locales/ja-JP.json';
import reportWebVitals from '@/reportWebVitals';
import { configKeys, getConfig } from '@/utils/config';
import { initLocale, LocaleCodes, localeCodes } from '@/utils/localization';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  environment: process.env.NODE_ENV,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

i18n.use(initReactI18next).init({
  resources: {
    [localeCodes.jaJp]: { translation: jaJpJson },
    [localeCodes.enUs]: { translation: enUsJson },
  },
  lng: getConfig(configKeys.locale) ?? localeCodes.jaJp,
  fallbackLng: localeCodes.jaJp,
});

initLocale((getConfig(configKeys.locale) as LocaleCodes) ?? localeCodes.jaJp);

// React 18 以降 ReactDOM.render に代わり createRoot の使用が推奨されている
// SEE: https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
