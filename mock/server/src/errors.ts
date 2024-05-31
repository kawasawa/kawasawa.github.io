import boom from '@hapi/boom';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ValidationError } from 'yup';

import { _fatal, warn } from './logger';

/**
 * 指定されたリクエストハンドラに対して、例外の発生と捕捉の共通化を行います。
 * @param requestHandler リクエストハンドラ
 * @returns 処理の共通化が行われたリクエストハンドラ
 */
export const withErrorHandler =
  (requestHandler: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await requestHandler(req, res, next);
    } catch (e) {
      // バリデーションエラーは既知の例外であるためハンドルする
      if (ValidationError.isError(e)) {
        warn(req, `validation failed. message=${e.message}`, e);
        next(e);
        return;
      }
      // 上記以外は想定外のエラーとして扱う
      const b = convertToBoomInstance(e);
      _fatal(req, 'unhandled exception occurred.', b);
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
  // その他の一般的な Error 型の場合は 500 として扱う
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
