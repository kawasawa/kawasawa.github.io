import boom from '@hapi/boom';
import httpMocks from 'node-mocks-http';

import { contentTypeFilter } from './contentTypeFilter';

describe('contentTypeFilter', () => {
  test('対象外の HTTP メソッドである場合、コールバック関数が呼び出されること', () => {
    // メソッドを実行
    const req = httpMocks.createRequest();
    req.method = 'GET';
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const middleware = contentTypeFilter('application/json', ['GET']);
    middleware(req, res, next);

    // コールバック関数を確認
    expect(next).toBeCalled();
  });

  test('指定されたコンテンツタイプに合致する場合、コールバック関数が呼び出されること', () => {
    // メソッドを実行
    const req = httpMocks.createRequest();
    req.headers['content-type'] = 'application/json';
    req.is = jest.fn().mockReturnValue(true);
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const middleware = contentTypeFilter('application/json');
    middleware(req, res, next);

    // コールバック関数を確認
    expect(next).toBeCalled();
  });

  test('サポートされていないコンテンツタイプの場合、415 エラーを返却すること', () => {
    // メソッドを実行
    const req = httpMocks.createRequest();
    req.headers['content-type'] = 'text/plain';
    req.is = jest.fn().mockReturnValue(false);
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const middleware = contentTypeFilter('application/json');
    middleware(req, res, next);

    // コールバック関数を確認
    expect(next).toBeCalledWith(boom.unsupportedMediaType('only application/json is supported.'));
  });
});
