/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { Request } from 'express';
import pino, { LoggerOptions } from 'pino';
import { Options as HttpOptions } from 'pino-http';

const MASKED_VALUE = '***';

/**
 * ロガーのオプションを取得します。
 */
export const options: {
  /** ロガーの共通設定 */
  pino: LoggerOptions;
  /** トレースログの設定 */
  pinoHttp: HttpOptions;
} = {
  pino: {
    // ログレベル
    level: process.env.LOG_LEVEL || 'trace',
    // タイムスタンプ書式
    timestamp: pino.stdTimeFunctions.isoTime,
    // マスキング
    serializers: {
      _csrf: (value) => (value ? MASKED_VALUE : undefined),
      password: (value) => (value ? MASKED_VALUE : undefined),
      email: (value) => (value ? `${String(value).slice(0, 3)}${MASKED_VALUE}` : undefined),
    },
    // フォーマット
    formatters: {
      // ログレベルのキー名を変更し出力値を大文字に変換
      level: (label) => ({ severity: label.toUpperCase() }),
      // 既定で出力される情報のキー名と順序を変更
      bindings: (bindings) => ({ hostname: bindings.hostname, processId: bindings.pid }),
    },
    // メッセージとエラーのキー名を変更
    messageKey: 'message',
    errorKey: 'error',
  },
  pinoHttp: {
    genReqId: () => crypto.randomUUID(),
    customLogLevel: () => 'trace',
    customReceivedMessage: () => 'request received.',
    customSuccessMessage: () => 'request succeeded.',
    customErrorMessage: () => 'request failed.',
    customAttributeKeys: { req: 'request', res: 'response', err: 'error', reqId: 'requestId' },
  },
} as const;

/** @deprecated この変数は使用しないでください。サーバの初期化設定時にのみ参照されます。 */
export const _logger = pino(options.pino);

/** @deprecated この関数は使用しないでください。商用環境ではこの関数は何も処理を行いません。*/
export const _debug = (req: Request, msg: string, ext = {}) => {
  if (process.env.NODE_ENV === 'development') _logger.debug(parseApiLog(req, ext), msg);
};

/**
 * INFO レベルのログを出力します。
 * @param req りクエスト情報
 * @param msg メッセージ
 * @param ext 追加項目
 */
export const info = (req: Request, msg: string, ext = {}) => _logger.info(parseApiLog(req, ext), msg);

/**
 * WARN レベルのログを出力します。
 * @description 本プロダクトにおける WARN レベルとは、処理の続行が可能なエラーを指します。
 * @param req りクエスト情報
 * @param msg メッセージ
 * @param err エラーオブジェクト
 * @param ext 追加項目
 */
export const warn = (req: Request, msg: string, err: Error, ext = {}) =>
  _logger.warn(parseApiLog(req, { ...ext, error: err.message, stack: err.stack }), msg);

/**
 * ERROR レベルのログを出力します。
 * @description 本プロダクトにおける ERROR レベルとは、処理の続行が不可能なエラーを指します。
 * @param req りクエスト情報
 * @param msg メッセージ
 * @param err エラーオブジェクト
 * @param ext 追加項目
 */
export const error = (req: Request, msg: string, err: Error, ext = {}) =>
  _logger.error(parseApiLog(req, { ...ext, error: err.message, stack: err.stack }), msg);

/** @deprecated この関数は使用しないでください。共通エラーハンドラでのみ利用されます。 */
export const _fatal = (req: Request, msg: string, err: Error, ext = {}) =>
  _logger.fatal(parseApiLog(req, { ...ext, error: err.message, stack: err.stack }), msg);

/**
 * DB クライアントのログを出力します。
 * @param event イベント情報
 * @param level イベントレベル
 * @param ext 追加項目
 */
export const dbLog = (event: Prisma.LogEvent, level: Exclude<Prisma.LogLevel, 'query'>, ext = {}) => {
  switch (level) {
    case 'info':
      _logger.info(parseDbLog(event, ext), event.message);
      break;
    case 'warn':
      _logger.warn(parseDbLog(event, ext), event.message);
      break;
    case 'error':
      _logger.error(parseDbLog(event, ext), event.message);
      break;
    default: {
      // NOTE: never 型による case 漏れの検出
      // case が未実装のリテラル型がある場合、コンパイルエラーとなるため事前に検出できる
      //
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = level;

      throw new RangeError(`invalid log level: ${level}`);
    }
  }
};

/**
 * DB クエリのログを出力します。
 * @param event イベント情報
 * @param ext 追加項目
 */
export const dbQuery = (event: Prisma.QueryEvent, ext = {}) => _logger.trace(parseDbLog(event, ext), 'query executed.');

/**
 * ログ出力用の JavaScript オブジェクトを構築します。
 * @param req リクエスト情報
 * @param ext 追加項目
 * @returns ログ出力用の JavaScript オブジェクト
 */
const parseApiLog = (req: Request, ext = {}) => ({
  requestId: req.id,
  method: req.method,
  url: req.url,
  remote: req.socket.remoteAddress ?? null,
  agent: req.header('user-agent') ?? null,
  ...ext,
});

/**
 * ログ出力用の JavaScript オブジェクトを構築します。
 * @param event イベント情報
 * @param ext 追加項目
 * @returns ログ出力用の JavaScript オブジェクト
 */
const parseDbLog = (event: Prisma.LogEvent | Prisma.QueryEvent, ext = {}) => ({
  isDbLog: true,
  target: event.target,
  timestamp: event.timestamp,
  duration: 'duration' in event ? event.duration : null,
  query: 'query' in event ? event.query : null,
  params: 'params' in event ? event.params : null,
  ...ext,
});
