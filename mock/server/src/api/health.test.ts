import Boom from '@hapi/boom';
import { Request, Response } from 'express';
import httpMocks from 'node-mocks-http';

import { boomError, error, index } from './health';

describe('health', () => {
  describe('index', () => {
    test('ステータスコードが 200 であり success: true が内包されていること', async () => {
      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      await index(req, res);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // レスポンスデータを確認
      const jsonResponse = res._getJSONData();
      expect(jsonResponse).toEqual({ success: true });
    });
  });

  describe('error', () => {
    test('エラーオブジェクトを引数にコールバック関数が呼び出されること', async () => {
      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await error(req, res, next);

      // コールバック関数を確認
      expect(next).toBeCalledWith(expect.any(Error));
    });
  });

  describe('boomError', () => {
    test('エラーオブジェクトを引数にコールバック関数が呼び出されること', async () => {
      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await boomError(req, res, next);

      // コールバック関数を確認
      expect(next).toBeCalledWith(expect.any(Boom.Boom));
    });
  });
});
