import dotenv from 'dotenv';
import fs from 'fs';

import { createApp } from './app';
import { initializeAdapter } from './db';

// OS のシグナルを捕捉する
process.on('SIGHUP', (signal) => {
  console.log(`SIGHUP signal received. : signal=`, signal);
});
process.on('SIGTERM', (signal) => {
  console.log(`SIGTERM signal received. : signal=`, signal);
});

// ハンドルされていない例外を捕捉する
process.on('uncaughtException', (err, origin) => {
  console.error('uncaught exception occurred. : error=', err, ', origin=', origin);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandled rejection occurred. : reason=', reason, ', promise=', promise);
  process.exit(1);
});

// 実行環境を特定する
const envName = process.env.NODE_ENV;
if (!envName) throw new Error(`NODE_ENV is empty.`);
console.log(`NODE_ENV identified. : envName="${envName}"`);

// 環境変数を読み込む
let envPath = `./.env.${envName}`;
if (!fs.existsSync(envPath)) envPath = './.env';
if (!fs.existsSync(envPath)) throw new Error(`.env does not exists. : path="${envPath}"`);
dotenv.config({ path: envPath });
console.log(`.env has been loaded. : path="${envPath}"`);

// OR マッパーを初期化する
initializeAdapter();

// サーバを起動する
const server = createApp();
server
  // NOTE: HTTP サーバを Express.js 内で構築して起動できる (Node.js のモジュールを使って)
  //   一方 PHP で使われる Laravel は HTTP サーバの機能を持たないため別で用意が必要になる
  //   HTTP サーバである Nginx などは起動と同時に Listen が始まり、Laravel (正確には PHP-FPM) にリクエストを振り分ける
  //   Express.js はこれらをアプリケーション側で実現できるため、専用の HTTP サーバが無くても動作する
  //   ※ ただし、実際は負荷分散や SSL 対応も必要なため、それらを高速に処理できる Nginx や AWS ALB (ロードバランサー) が置かれることが多い
  .listen(process.env.EXPRESS_PORT, () => {
    console.log(`start to listen. : port="${process.env.EXPRESS_PORT}"`);
  })
  .on('error', (err) => {
    console.error('failed to start. : error=', err);
    process.exit(1);
  });
