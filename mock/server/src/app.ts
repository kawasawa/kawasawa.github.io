import boom from '@hapi/boom';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { convertToBoomInstance } from './errors';
import { _logger, options as loggerOptions } from './lib';
import { contentTypeFilter, sslFilter } from './middlewares';
import { ApiErrorResponse } from './responses';
import { devRouter, healthRouter, spreadsheetsRouter } from './routes';

// NOTE: CORS ポリシーはセキュリティの観点で少なくとも Origin, Methods を設定する
const corsOptions: cors.CorsOptions = {
  // リクエストを許可するオリジンを制限する
  //   Origin ヘッダーはリクエストの際にブラウザによってオリジンの情報を自動付与される
  //   API サーバはこの情報を検証し、指定された Origin 以外からのリクエストを拒否する
  //   (クライアントが古いブラウザの場合は Origin ヘッダーが付与されないため一律で拒否される)
  //   なお、Access-Control-Allow-Credentials が有効な場合は Access-Control-Allow-Origin にワイルドカードを指定できない、必ず明示的に設定する
  origin: process.env.NODE_ENV === 'production' ? 'https://kawasawa.github.io' : 'http://localhost:3000',
  // リクエストを許可する HTTP メソッドを制限する
  //
  // NOTE: REST API の PATCH メソッドはほとんど使われていない
  //   一般的に登録系メソッドは、リソース全般の新規登録や送信を POST、それらの更新を PUT が利用される
  //   PATCH はほとんど利用されず、RFC でも削除と再定義を繰り返している
  //   PATCH の役割はリソースの一部更新、PUT はリソースの置換であり、
  //   例えばメールアドレス更新やパスワード再発行などは、厳密に言えば PATCH の方が理に適っている
  //   しかし、古いサーバでは PATCH をサポートしていないこともあり、そもそも PUT で特段問題が無いため、
  //   クライアント側も使い分けを意識せずに済む PUT にまとめてしまうことも多い
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // クライアントが Cookie を HTTP ヘッダーに含めることを許可する
  //   Double Submit Cookie 方式で検証するため必要になる
  credentials: true,
}; //as const;

// NOTE: Cookie ポリシーはセキュリティの観点で少なくとも httpOnly, secure, sameSite を設定する
export const cookieOptions: express.CookieOptions = {
  // クライアントに対して JavaScript からの Cookie アクセスを禁止する
  httpOnly: true,
  // クライアントに対して HTTPS 通信時のみ Cookie を送信するよう制限する
  secure: process.env.NODE_ENV === 'production',
  // クライアントに対してクロスオリジンにおける Cookie の送信を制限する
  //   strict: 同一オリジンのみ許可、lax: 同一オリジンに加え別オリジンの GET も許可, none: すべてのオリジンに許可
  //   lax はメールや SNS のリンク、検索エンジンの結果から遷移（クロスサイトナビゲーション）した際も Cookie が送信されるため認証状態の維持などに役立つ
  //   none はクロスサイトリクエストに送信が許可されるため、OAuth 認証など外部サービスとの連携などに限定して使用する（必ず Secure 属性を設定する）
  //   利便性の観点から既定値に lax が指定されるブラウザが多いものの、デフォルトの挙動に差異があるため SameSite 属性は明示的に指定する
  sameSite: 'lax',
  // Max-Age はライブラリによって単位の解釈が異なるためが注意が必要
  // csurf 内部の cookie パッケージでは秒単位として、Express.js ではミリ秒単位として解釈される
  //maxAge: 10 * 60,
} as const;

export const csrfConstants = {
  CSRF_SECRET_COOKIE_NAME: 'csrf_secret',
  CSRF_SECRET_COOKIE_MAX_AGE: 10 * 60, // 秒単位
  CSRF_TOKEN_COOKIE_NAME: 'csrf_token',
  CSRF_TOKEN_COOKIE_MAX_AGE: 1 * 60 * 1000, // ミリ秒単位
  CSRF_TOKEN_HEADER_NAME: 'x-csrf-token',
} as const;

const csrfOptions: {
  value?: ((req: Request) => string) | undefined;
  cookie?: csrf.CookieOptions;
  ignoreMethods?: string[];
  sessionKey?: string | undefined;
} = {
  // CSRF トークンの検証をパスする HTTP メソッドを指定する
  ignoreMethods: ['GET'],
  // Cookie のオプションを設定する
  //   このオプションを指定することで、ミドルウェアは Cookie と HTTP ヘッダーの両方でトークンを保持する Double Submit Cookie 方式で検証を実施する
  //   ミドルウェアがシークレット値を生成し Set-Cookie ヘッダーにセット、レスポンスを受けたクライアントのブラウザが Cookie を保存する
  //   クライアントはリクエストの際、自動送信される Cookie に加え HTTP ヘッダーに Cookie を含めて送信する
  //   この方式はステートレスな API サーバにおける CSRF 対策手法の一つである
  //   上記の流れを実現するため CORS ポリシーで Access-Control-Allow-Credentials を有効化しておく必要がある
  cookie: {
    ...cookieOptions,
    maxAge: csrfConstants.CSRF_SECRET_COOKIE_MAX_AGE,
    // CSRF シークレットを格納する Cookie の名称を指定する
    //   既定では '_csrf' がキー名として指定されている
    //   see: https://github.com/expressjs/csurf/blob/f4fa792167c2bc5ec3576cc8c4f2776df2336271/index.js#L245
    key: csrfConstants.CSRF_SECRET_COOKIE_NAME,
  },
  // CSRF トークンの取得先を指定する
  //   既定では body または query の _csrf、あるいは headers の csrf-token, xsrf-token, x-csrf-token, x-xsrf-token から取得される
  //   see: https://github.com/expressjs/csurf/blob/f4fa792167c2bc5ec3576cc8c4f2776df2336271/index.js#L130
  value: (req) => req.header(csrfConstants.CSRF_TOKEN_HEADER_NAME) || '',
}; //as const;

export const createApp = () => {
  const app = express();

  // ログ出力
  app.use(pinoHttp({ ...loggerOptions.pinoHttp, logger: _logger }));
  // CORS対応
  app.use(cors(corsOptions));
  // Content-Typeフィルタ
  //   CORS 仕様外の `Content-Type: application/json` が指定されることで (POST, PUT, PATCH, DELETE 時に) プリフライトリクエストが発生する
  //   プリフライトリクエストを受けたサーバは CORS ポリシーを確認し、後続リクエストを許可するかどうかを決定する
  app.use(contentTypeFilter('application/json', ['GET']));
  // SSLフィルタ
  //   https にリダイレクトする
  app.all('*', sslFilter);
  // セキュリティヘッダー付与
  //   XSS対策関連のヘッダー (X-XSS-Protection, X-Content-Type-Options, Content-Security-Policy, Cross-Origin-Embedder-Policy, Cross-Origin-Resource-Policy 等) を含む
  //   併せて X-Powered-By が除去される
  app.use(helmet());
  // Cookieパーサ
  //   csurf が Cookie 経由で CSRF トークン及びシークレットを授受する場合、事前に cookie-parser を初期化する必要がある
  //   see: https://github.com/expressjs/csurf/blob/f4fa792167c2bc5ec3576cc8c4f2776df2336271/README.md
  app.use(cookieParser());
  // JSONパーサ
  app.use(express.json());
  // Bodyパーサ
  app.use(express.urlencoded({ extended: true }));

  // ヘルスチェック
  app.use('/health', healthRouter);

  // ルーティング
  const csrfFilter = csrf(csrfOptions);
  app.use('/dev', csrfFilter, devRouter);
  app.use('/spreadsheets', csrfFilter, spreadsheetsRouter);

  // NotFound ハンドラ
  app.use((req, res, next) => next(boom.notFound('requested entity was not found.')));

  // グローバルエラーハンドラ
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const b = convertToBoomInstance(err);
    const body = {
      error: {
        code: b.output.payload.statusCode,
        message: b.output.payload.message,
        status: b.output.payload.error,
      },
    } as ApiErrorResponse;
    res.status(b.output.statusCode).json(body);
  });

  return app;
};
