import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { ApiSuccessResponse } from '../responses';
import { createSchema } from '../schemas/dev';

export const error = () => {
  throw new Error('dummy error');
};

export const boomError = () => {
  throw boom.internal('dummy boom error');
};

export const asyncError = async (req: Request, res: Response, next: NextFunction) => {
  // 非同期関数の例外は try-catch しないと捕捉できない
  try {
    throw new Error('dummy async error');
  } catch (e) {
    next(e);
  }
};

export const csrfToken = (req: Request, res: Response) => {
  // 本来の CSRF トークンは、サーバが生成し html ともに返却、クライアントがそれをレンダリングし form タグから同期的に POST されるのが一般的である
  // Laravel や Rails など多くのフルスタックフレームワークではこの機構が搭載されている
  // 一方 SPA の場合 Next.js の NextAuth.js では getServerSideProps を使いサーバサイドでトークンを取得しクライアントに引き渡し非同期で通信している
  // ただし Vercel の見解にあるように、モダンブラウザでは Origin ヘッダーと SameSite 属性で CSRF 攻撃を概ね防げるため、フレームワーク側で対策を実装しないケースも増えている
  // とはいえ、現段階では古いブラウザ等の存在を考慮するとまだ CSRF トークンが必要になる
  res.status(200).json({ success: true, data: req.csrfToken() } as ApiSuccessResponse);
};

export const send = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = await createSchema().validate(req.body);
    res.status(200).json({ success: true, data: params } as ApiSuccessResponse);
  } catch (e) {
    next(e);
  }
};
