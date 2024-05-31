import boom from '@hapi/boom';
import httpMocks from 'node-mocks-http';

import { asyncError, boomError, csrfToken, error, send } from './dev';

jest.mock('../schemas/dev', () => ({
  __esModule: true,
  ...jest.requireActual('../schemas/dev'),
  createSchema: jest.fn().mockReturnValue({ validate: jest.fn().mockImplementation((args) => args) }),
}));

describe('dev', () => {
  describe('error', () => {
    test('例外がスローされること', async () => {
      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await error(req, res, next);

      // コールバック関数を確認
      expect(next).toBeCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('dummy error');
    });
  });

  describe('boomError', () => {
    test('例外がスローされること', async () => {
      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await boomError(req, res, next);

      // コールバック関数を確認
      expect(next).toBeCalledWith(expect.any(boom.Boom));
      expect(next.mock.calls[0][0].message).toBe('dummy boom error');
    });
  });

  describe('asyncError', () => {
    test('エラーオブジェクトを引数にコールバック関数が呼び出されること', async () => {
      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await asyncError(req, res, next);

      // コールバック関数を確認
      expect(next).toBeCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('dummy async error');
    });
  });

  describe('csrfToken', () => {
    test('CSRF トークンが返却されること', async () => {
      // メソッドを実行
      const req = httpMocks.createRequest({
        csrfToken: () => 'dummy_csrf_token',
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await csrfToken(req, res, next);

      // レスポンスを確認
      const data = res._getJSONData();
      expect(res.statusCode).toBe(200);
      expect(data).toEqual({ success: true, data: 'dummy_csrf_token' });
    });
  });

  describe('send', () => {
    test('リクエストボディと同値のオブジェクトが返却されること', async () => {
      // メソッドを実行
      const req = httpMocks.createRequest({
        body: { key: 'value' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await send(req, res, next);

      // レスポンスを確認
      const data = res._getJSONData();
      expect(res.statusCode).toBe(200);
      expect(data).toEqual({ success: true, data: { key: 'value' } });
    });
  });
});
