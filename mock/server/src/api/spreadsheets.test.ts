import Boom from '@hapi/boom';
import * as PrismaClient from '@prisma/client';
import { Request, Response } from 'express';
import httpMocks from 'node-mocks-http';

import { articlesMetadata, articlesPickup, version } from './spreadsheets';

// allow redefine
jest.mock('@prisma/client', () => ({
  __esModule: true,
  ...jest.requireActual('@prisma/client'),
}));

describe('spreadsheets', () => {
  const spy_PrismaClient = jest.spyOn(PrismaClient, 'PrismaClient');

  beforeEach(() => {
    spy_PrismaClient.mockClear();
  });

  describe('articlesMetadata', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = {
        id: '5a6dee26db36aa83915f',
        title: '[覚書] MVVM の定義',
        body: '## はじめに 忘れないように戒めの覚え書き。 以下、すべて独学のオレオレ MVVM で、原理原則から逸脱している部分もあるはず... あくまで個人的にはですが、使えるなら細かい定義は気にしない考えで...',
        tags: 'MVVM',
        url: 'https://qiita.com/kawasawa/items/5a6dee26db36aa83915f',
        likes_count: 10,
        stocks_count: 4,
        comments_count: 0,
        created_at: '2020-04-14T23:24:23+09:00',
        updated_at: '2020-08-09T08:22:24+09:00',
      };

      // モック
      const mock_findMany = jest.fn().mockResolvedValue([
        {
          ...dummy_data,
          created_at: new Date(dummy_data.created_at),
          updated_at: new Date(dummy_data.updated_at),
        },
      ]);
      spy_PrismaClient.mockReturnValue({ articles_metadata: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await articlesMetadata(req, res, next);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();

      // レスポンスデータを確認
      const json = res._getJSONData();
      expect(Object.keys(json).length).toBe(3);
      expect(json.range).toBe("'articles-metadata'!A1:Z1000");
      expect(json.majorDimension).toBe('ROWS');
      expect(json.values.length).toBe(2);
      expect(json.values[0]).toEqual(Object.keys(dummy_data));
      expect(json.values[1]).toEqual(Object.values(dummy_data));
    });

    test('DBからレコードの取得に失敗した場合は例外をスローすること', async () => {
      // モック
      const mock_findMany = jest.fn().mockResolvedValue([]);
      spy_PrismaClient.mockReturnValue({ articles_metadata: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await articlesMetadata(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(Boom.notFound());
    });

    test('処理の過程で何らかのエラーが発生した場合は例外をスローすること', async () => {
      // ダミーデータ
      const dummy_error = new Error('TEST_error');

      // モック
      const mock_findMany = jest.fn().mockImplementation(() => {
        throw dummy_error;
      });
      spy_PrismaClient.mockReturnValue({ articles_metadata: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await articlesMetadata(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
  });

  describe('articlesPickup', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = {
        id: '80960c415a972219d8e1',
        data: 'data:image/webp;base64,UklGRlA4...',
      };

      // モック
      const mock_findMany = jest.fn().mockResolvedValue([dummy_data]);
      spy_PrismaClient.mockReturnValue({ articles_pickup: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await articlesPickup(req, res, next);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();

      // レスポンスデータを確認
      const json = res._getJSONData();
      expect(Object.keys(json).length).toBe(3);
      expect(json.range).toBe("'articles-pickup'!A1:Z1000");
      expect(json.majorDimension).toBe('ROWS');
      expect(json.values.length).toBe(2);
      expect(json.values[0]).toEqual(Object.keys(dummy_data));
      expect(json.values[1]).toEqual(Object.values(dummy_data));
    });

    test('DBからレコードの取得に失敗した場合は例外をスローすること', async () => {
      // モック
      const mock_findMany = jest.fn().mockResolvedValue([]);
      spy_PrismaClient.mockReturnValue({ articles_pickup: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await articlesPickup(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(Boom.notFound());
    });

    test('処理の過程で何らかのエラーが発生した場合は例外をスローすること', async () => {
      // ダミーデータ
      const dummy_error = new Error('TEST_error');

      // モック
      const mock_findMany = jest.fn().mockImplementation(() => {
        throw dummy_error;
      });
      spy_PrismaClient.mockReturnValue({ articles_pickup: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await articlesPickup(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
  });

  describe('version', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = {
        last_update: '2020/01/01 3:00:00',
      };

      // モック
      const mock_findMany = jest.fn().mockResolvedValue([dummy_data]);
      spy_PrismaClient.mockReturnValue({ version: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await version(req, res, next);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();

      // レスポンスデータを確認
      const json = res._getJSONData();
      expect(Object.keys(json).length).toBe(3);
      expect(json.range).toBe('version!A1:Z1000');
      expect(json.majorDimension).toBe('ROWS');
      expect(json.values.length).toBe(2);
      expect(json.values[0]).toEqual(Object.keys(dummy_data));
      expect(json.values[1]).toEqual(Object.values(dummy_data));
    });

    test('DBからレコードの取得に失敗した場合は例外をスローすること', async () => {
      // モック
      const mock_findMany = jest.fn().mockResolvedValue([]);
      spy_PrismaClient.mockReturnValue({ version: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await version(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(Boom.notFound());
    });

    test('処理の過程で何らかのエラーが発生した場合は例外をスローすること', async () => {
      // ダミーデータ
      const dummy_error = new Error('TEST_error');

      // モック
      const mock_findMany = jest.fn().mockImplementation(() => {
        throw dummy_error;
      });
      spy_PrismaClient.mockReturnValue({ version: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest<Request>();
      const res = httpMocks.createResponse<Response>();
      const next = jest.fn();
      await version(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
  });
});
