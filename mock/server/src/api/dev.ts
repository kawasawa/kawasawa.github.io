import boom from '@hapi/boom';
import { Request, Response } from 'express';

import { cookieOptions, csrfConstants } from '../app';
import { withErrorHandler } from '../errors';
import { info } from '../lib';
import { ApiSuccessResponse } from '../responses';
import { createSchema } from '../schemas/dev';

export const error = withErrorHandler(() => {
  throw new Error('dummy error');
});

export const boomError = withErrorHandler(() => {
  throw boom.internal('dummy boom error');
});

export const asyncError = withErrorHandler(async () => {
  throw new Error('dummy async error');
});

export const csrfToken = withErrorHandler((req: Request, res: Response) => {
  // 本来の CSRF トークンは、サーバが生成し html ともに返却、クライアントがそれをレンダリングし form タグから同期的に POST されるのが一般的である
  // Laravel や Rails など多くのフルスタックフレームワークではこの機構が搭載されている
  // 一方 SPA の場合 Next.js の NextAuth.js では getServerSideProps を使いサーバサイドでトークンを取得しクライアントに引き渡し非同期で通信している
  // ただし Vercel の見解にあるように、モダンブラウザでは Origin ヘッダーと SameSite 属性で CSRF 攻撃を概ね防げるため、フレームワーク側で対策を実装しないケースも増えている
  // とはいえ、現段階では古いブラウザ等の存在を考慮するとまだ CSRF トークンが必要になる
  res
    .status(200)
    .cookie(csrfConstants.CSRF_TOKEN_COOKIE_NAME, req.csrfToken(), {
      ...cookieOptions,
      maxAge: csrfConstants.CSRF_TOKEN_COOKIE_MAX_AGE,
      // クライアントの Axios によって Cookie に保存された CSRF トークンを HTTP ヘッダーに設定するため JavaScript からのアクセスを許可する
      // 一方 CSRF シークレットはブラウザによって自動付与されるため無効化している (CSRF シークレットについてはミドルウェアの初期化処理を参照)
      // ---
      // そもそも今回の例のシークレットとトークンの両方が Cookie に保存する運用の有用性は若干怪しいものがある
      // この実装には理由があり、
      // csurf が CSRF シークレットを Set-Cookie で送信し Allow-Credentials によって Cookie と HTTP ヘッダーの両方で受け取り Double Submit Cookie 方式で検証を目論んでいることに加え、
      // Axios 側も xsrfCookieName で CSRF トークンを Cookie から取得し xsrfHeaderName で HTTP ヘッダーに乗せようとしていることに起因する
      // おそらく Axios 側は CSRF シークレットを Cookie に保存する想定をしておらず、csurf 側も CSRF トークンを Cookie で渡す想定をしていない
      // その状態で両者の既定運用に乗るよう処理を寄せたためこのようになった
      // 実際はステートフルにして CSRF シークレットはクライアントに渡さないか、或いはステートレスにするのであれば JWT 等を活用すべきであろう
      httpOnly: false,
    })
    .json({ success: true } as ApiSuccessResponse);
});

export const send = withErrorHandler(async (req: Request, res: Response) => {
  const params = await createSchema().validate(req.body);
  info(req, 'mail send', params);
  res.status(200).json({ success: true, data: params } as ApiSuccessResponse);
});
