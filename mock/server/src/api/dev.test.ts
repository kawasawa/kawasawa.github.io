import boom from '@hapi/boom';
import httpMocks from 'node-mocks-http';

import { asyncError, boomError, error } from './dev';

describe('dev', () => {
  describe('error', () => {
    test('例外がスローされること', () => {
      expect(() => error()).toThrow('dummy error');
    });
  });

  describe('boomError', () => {
    test('例外がスローされること', () => {
      expect(() => boomError()).toThrow(boom.internal('dummy boom error'));
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
});
