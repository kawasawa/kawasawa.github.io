import boom from '@hapi/boom';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ValidationError } from 'yup';

import { _fatal, info } from './logger';

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
  return boom.boomify(new Error(String(err)), { statusCode: boom.internal().output.statusCode });
};

/**
 * 指定されたリクエストハンドラに対して、例外の発生を監視しハンドリングを行います。
 * @param handler リクエストハンドラ
 * @returns エラーハンドリングを行ったリクエストハンドラ
 */
export const observeError = (handler: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await handler(req, res, next);
  } catch (e) {
    // バリデーションエラーは既知の例外であるためハンドルする
    if (ValidationError.isError(e)) {
      info(req, `validation failed. message=${e.message}`);
      next(e);
      return;
    }
    // 上記以外は想定外のエラーとして扱う
    const b = convertToBoomInstance(e);
    _fatal(req, 'unhandled exception occurred.', b);
    next(b);
  }
};
