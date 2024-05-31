import boom from '@hapi/boom';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ValidationError } from 'yup';

import { _fatal, error, warn } from './lib';

/**
 * 指定されたリクエストハンドラに対して、例外の発生と捕捉の共通化を行います。
 * @param requestHandler リクエストハンドラ
 * @returns 処理の共通化が行われたリクエストハンドラ
 */
export const withErrorHandler =
  (requestHandler: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await requestHandler(req, res, next);
    } catch (err) {
      // エラーインスタンスを共通化する
      const isManual = boom.isBoom(err);
      const b = convertToBoomInstance(err);

      // NOTE: REST API はステータスコードでエラーの発生源を判別する
      //   (もちろん API が適切なステータスコードを設定することが前提である)
      //   - 4xx: クライアント起因
      //     - 401: 認証エラー
      //     - 403: 認可エラー
      //     - 404: リソースが存在しない
      //     - 400: その他のエラー (バリデーションエラーなども含む)
      //   - 5xx: サーバ起因
      //     - 500: サーバ内エラー
      // ログを発行する
      if (!b.isServer) {
        // クライアント起因の例外は WARN とする
        warn(req, 'request failed. client-side error occurred.', b);
      } else if (isManual) {
        // 明示的に throw された例外は ERROR とする
        error(req, 'request failed. server-side error occurred.', b);
      } else {
        // ハンドルされていない例外は FATAL とする
        _fatal(req, 'request failed. unhandled error occurred.', b);
      }

      // レスポンスを返却する
      // NOTE: 5xx エラーはセキュリティの観点でメッセージを隠蔽すべきである
      //   本プロダクトでは boom が例外をラップし 5xx のメッセージを置き換えている
      //   see: https://hapi.dev/module/boom/api/?v=10.0.1#http-5xx-errors
      next(b);
    }
  };

/**
 * エラーオブジェクトを Boom インスタンスに変換します。
 * @param err エラーオブジェクト
 * @returns boom インスタンス
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const convertToBoomInstance = (err: any) => {
  // Boom インスタンスの場合はそのまま返す
  if (boom.isBoom(err)) {
    return err;
  }
  // バリデーションエラーの場合は 400 として扱う
  if (ValidationError.isError(err)) {
    return boom.badRequest(err.message ?? 'validation failed.');
  }
  // ユニーク制約エラーの場合は 409 として扱う
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return boom.conflict(err.message);
    }
  }
  // CSRF トークンエラーの場合は 401 として扱う
  if (err.code === 'EBADCSRFTOKEN') {
    return boom.unauthorized(err);
  }
  // その他の Error 型の場合は 500 として扱う
  if (err instanceof Error) {
    return boom.boomify(err, { statusCode: boom.internal().output.statusCode });
  }

  // いずれにも当てはまらない不明なオブジェクトの場合はそれを Error 型に内包し 500 として扱う
  let message: string;
  try {
    message = JSON.stringify(err);
  } catch {
    message = String(err);
  }
  return boom.boomify(new Error(message), { statusCode: boom.internal().output.statusCode });
};
