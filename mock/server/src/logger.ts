/* eslint-disable @typescript-eslint/no-explicit-any */

import crypto from 'crypto';
import { Request } from 'express';
import pino, { LoggerOptions } from 'pino';
import { Options as HttpOptions } from 'pino-http';

export const options = {
  // ロガーの共通設定
  pino: {
    level: process.env.LOG_LEVEL || 'trace',
    // 時刻の書式を ISO フォーマットに変更
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      // ログレベルのキー名を変更
      // 出力値を大文字の文字列に変更
      level: (label) => ({ severity: label.toUpperCase() }),
      // プロセス ID のキー名を変更
      // ホスト名を出力項目から除外
      bindings: (bindings) => ({ processId: bindings.pid }),
    },
    // メッセージとエラーのキー名を変更
    messageKey: 'message',
    errorKey: 'error',
  } as LoggerOptions,
  // トレースログの設定
  pinoHttp: {
    customLogLevel: () => 'trace',
    customReceivedMessage: () => 'request received.',
    customSuccessMessage: () => 'request succeeded.',
    customErrorMessage: () => 'request failed.',
    genReqId: () => crypto.randomUUID(),
    customAttributeKeys: { req: 'request', res: 'response', err: 'error', reqId: 'requestId' },
  } as HttpOptions,
} as const;

export const logger = pino(options.pino);

const format = (req: Request, ext = {}) => ({
  requestId: req.id,
  method: req.method.toUpperCase(),
  url: req.url,
  remote: req.socket.remoteAddress ?? null,
  referer: req.get('referer') ?? null,
  ...ext,
});

/**
 * INFO レベルのログを出力します。
 * @param req りクエスト情報
 * @param msg メッセージ
 * @param ext 追加項目
 */
export const info = (req: Request, msg: string, ext = {}) => logger.info(format(req, ext), msg);

/**
 * WARN レベルのログを出力します。
 * @description 本プロダクトにおける WARN レベルとは、想定されており処理の続行が可能なエラーを指します。
 * @param req りクエスト情報
 * @param msg メッセージ
 * @param err エラーオブジェクト
 * @param ext 追加項目
 */
export const warn = (req: Request, msg: string, err: Error, ext = {}) =>
  logger.warn(format(req, { ...ext, [options.pino.errorKey as string]: err.message, stack: err.stack }), msg);

/**
 * ERROR レベルのログを出力します。
 * @description 本プロダクトにおける ERROR レベルとは、想定されているが処理の続行が不可能なエラーを指します。
 * @param req りクエスト情報
 * @param msg メッセージ
 * @param err エラーオブジェクト
 * @param ext 追加項目
 */
export const error = (req: Request, msg: string, err: Error, ext = {}) =>
  logger.error(format(req, { ...ext, [options.pino.errorKey as string]: err.message, stack: err.stack }), msg);

/** @deprecated この関数は使用しないでください。実装時のデバッグのみに利用し、製品コードには含めないでください。 */
export const debug = (req: Request, msg: string, ext = {}) => logger.debug(format(req, ext), msg);
/** @deprecated この関数は使用しないでください。未処理エラーハンドラのみで利用されます。 */
export const fatal = (req: Request, msg: string, err: Error, ext = {}) =>
  logger.fatal(format(req, { ...ext, [options.pino.errorKey as string]: err.message, stack: err.stack }), msg);
