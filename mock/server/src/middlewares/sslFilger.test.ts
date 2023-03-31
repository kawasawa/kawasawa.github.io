import { Request, Response } from 'express';
import httpMocks from 'node-mocks-http';

import { sslFilter } from './sslFilter';

describe('sslFilter', () => {
  test('production 環境以外の場合、コールバック関数が呼び出されること', () => {
    process.env.NODE_ENV = 'development';

    // メソッドを実行
    const req = httpMocks.createRequest<Request>();
    const res = httpMocks.createResponse<Response>();
    const next = jest.fn();
    sslFilter(req, res, next);

    // コールバック関数を確認
    expect(next).toBeCalled();
  });

  test('リクエストが http プロトコル以外の場合、コールバック関数が呼び出されること', () => {
    process.env.NODE_ENV = 'production';

    // メソッドを実行
    const req = httpMocks.createRequest<Request>();
    req.protocol = 'https';
    const res = httpMocks.createResponse<Response>();
    const next = jest.fn();
    sslFilter(req, res, next);

    // コールバック関数を確認
    expect(next).toBeCalled();
  });

  test('production 環境かつ http プロトコルによるリクエストの場合、https プロトコルでリダイレクトされること', () => {
    process.env.NODE_ENV = 'production';

    // メソッドを実行
    const req = httpMocks.createRequest<Request>();
    req.protocol = 'http';
    req.originalUrl = '/test';
    req.get = jest.fn().mockReturnValue('localhost');
    const res = httpMocks.createResponse<Response>();
    const next = jest.fn();
    sslFilter(req, res, next);

    // ステータスコードを確認
    expect(res.statusCode).toBe(301);

    // コールバック関数を確認
    expect(res._getRedirectUrl()).toBe('https://localhost/test');
  });
});
