import httpMocks from 'node-mocks-http';

import { sslFilter } from './sslFilter';

describe('sslFilter', () => {
  let _nodeEnv: string | undefined;

  beforeAll(() => {
    _nodeEnv = process.env.NODE_ENV;
  });

  afterAll(() => {
    // process.env は型定義によって readonly を付与しておりそのままでは代入できない
    // テストの際は defineProperty でプロパティごと再定義する
    Object.defineProperty(process.env, 'NODE_ENV', { value: _nodeEnv, writable: false });
  });

  test('production 環境以外の場合、コールバック関数が呼び出されること', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });

    // メソッドを実行
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();
    sslFilter(req, res, next);

    // コールバック関数を確認
    expect(next).toBeCalled();
  });

  test('リクエストが http プロトコル以外の場合、コールバック関数が呼び出されること', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });

    // メソッドを実行
    const req = httpMocks.createRequest();
    Object.defineProperty(req, 'protocol', { value: 'https' });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    sslFilter(req, res, next);

    // コールバック関数を確認
    expect(next).toBeCalled();
  });

  test('production 環境かつ http プロトコルによるリクエストの場合、https プロトコルでリダイレクトされること', () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });

    // メソッドを実行
    const req = httpMocks.createRequest();
    Object.defineProperty(req, 'protocol', { value: 'http' });
    req.originalUrl = '/test';
    req.header = jest.fn().mockReturnValue('localhost');
    const res = httpMocks.createResponse();
    const next = jest.fn();
    sslFilter(req, res, next);

    // ステータスコードを確認
    expect(res.statusCode).toBe(301);

    // コールバック関数を確認
    expect(res._getRedirectUrl()).toBe('https://localhost/test');
  });
});
