import boom from '@hapi/boom';
import { Request, Response } from 'express';

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
  res.status(200).json({ success: true, data: req.csrfToken() } as ApiSuccessResponse);
});

export const send = withErrorHandler(async (req: Request, res: Response) => {
  const params = await createSchema().validate(req.body);
  info(req, 'mail send', params);
  res.status(200).json({ success: true, data: params } as ApiSuccessResponse);
});
