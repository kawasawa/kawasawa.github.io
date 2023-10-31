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

// NOTE: React i18next は柔軟な記載が可能
// - ネームスペース (※ 本構成では未使用)
//     翻訳ファイル自体を分割管理することが可能
//       words.json    { "a": "*****" }
//       messages.json { "a": "xxxxx" }
//     React から呼び出す際は、先頭に対象のネームスペースを記載し `:` で区切る
//       t('words:a')
//       // '*****'
// - グルーピング
//     JSON オブジェクトを階層化することでグルーピングが可能
//       { "a": { "b": "*****" } }
//     React から呼び出す際は、 `.` 区切りで指定する
//       t('a.b')
//       // '*****'
// - コンテキスト
//     キーに `_` を付与することで類似メッセージの分岐が可能 (例えば年齢や性別での使い分けがある表現等に用いる)
//       { "a_male": "*****", "a_female": "xxxxx" }
//     React から呼び出す際は、第二引数で `context` を指定する
//       t('a', { context: 'male' })
//       // '*****'
// - ネスト
//     メッセージ内に `$t(key)` を設けることで他の翻訳情報の参照が可能
//       { "a": "***** $t(b)", "b": "xxxxx" }
//     React から呼び出す際は、通常通りにメッセージキーを指定する
//       t('a')
//       // '***** xxxxx'
// - プレースホルダー
//     メッセージ内に `{{` `}}` で囲まれた変数を設けることで文字列補間が可能
//       { "a": "***** {{message}}" }
//     React から呼び出す際は、第二引数で補間先の変数を指定する
//       t('a', { message: 'xxxxx' })
//       // '***** xxxxx'
i18n.use(initReactI18next).init({
  resources: {
    [localeCodes.jaJp]: { translation: jaJpJson },
    [localeCodes.enUs]: { translation: enUsJson },
  },
  lng: getConfig(configKeys.locale) ?? localeCodes.jaJp,
  supportedLngs: Object.values(localeCodes),
  fallbackLng: localeCodes.jaJp,
  //reloadOnPrerender: process.env.NODE_ENV === "development",
  //debug: process.env.NODE_ENV === "development",
});

initLocale((getConfig(configKeys.locale) as LocaleCodes) ?? localeCodes.jaJp);

// React 18 以降 ReactDOM.render に代わり createRoot の使用が推奨されている
// see: https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
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
