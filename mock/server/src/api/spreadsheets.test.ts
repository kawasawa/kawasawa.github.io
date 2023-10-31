import boom from '@hapi/boom';
import httpMocks from 'node-mocks-http';

import * as Prisma from '../lib/prisma';
import { articlesMetadata, articlesPickup, version } from './spreadsheets';

// allow redefine
jest.mock('../lib/prisma', () => ({
  getDbClient: jest.fn(),
}));

describe('spreadsheets', () => {
  const spy_getDbClient = jest.spyOn(Prisma, 'getDbClient');

  beforeEach(() => {
    spy_getDbClient.mockClear();
  });

  describe('articlesMetadata', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = [
        {
          id: '5a6dee26db36aa83915f',
          title_ja_jp: '[覚書] MVVM の定義',
          title_en_us: '[Memorandum] Definition of MVVM',
          body_ja_jp:
            '## はじめに 忘れないように戒めの覚え書き。 以下、すべて独学のオレオレ MVVM で、原理原則から逸脱している部分もあるはず... あくまで個人的にはですが、使えるなら細かい定義は気にしない考えで...',
          body_en_us:
            "## Introduction A reminder of the commandments so you don't forget them. The following is all self-taught MVVM, and there are bound to be some parts that deviate from the principles... This is just my personal opinion, but I don't care about detailed definitions as long as it's usable...",
          tags: 'MVVM',
          url: 'https://qiita.com/kawasawa/items/5a6dee26db36aa83915f',
          likes_count: 10,
          stocks_count: 4,
          comments_count: 0,
          created_at: new Date('2020-04-14T23:24:23+09:00'),
          updated_at: new Date('2020-08-09T08:22:24+09:00'),
        },
      ];
      const expect_data = [
        {
          id: '5a6dee26db36aa83915f',
          'title_ja-JP': '[覚書] MVVM の定義',
          'title_en-US': '[Memorandum] Definition of MVVM',
          'body_ja-JP':
            '## はじめに 忘れないように戒めの覚え書き。 以下、すべて独学のオレオレ MVVM で、原理原則から逸脱している部分もあるはず... あくまで個人的にはですが、使えるなら細かい定義は気にしない考えで...',
          'body_en-US':
            "## Introduction A reminder of the commandments so you don't forget them. The following is all self-taught MVVM, and there are bound to be some parts that deviate from the principles... This is just my personal opinion, but I don't care about detailed definitions as long as it's usable...",
          tags: 'MVVM',
          url: 'https://qiita.com/kawasawa/items/5a6dee26db36aa83915f',
          likes_count: 10,
          stocks_count: 4,
          comments_count: 0,
          created_at: '2020-04-14T23:24:23+09:00',
          updated_at: '2020-08-09T08:22:24+09:00',
        },
      ];

      // モック
      const mock_findMany = jest.fn().mockResolvedValue(dummy_data);
      spy_getDbClient.mockReturnValue({ articles_metadata: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
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
      expect(json.values.length).toBe(expect_data.length + 1);
      expect(json.values[0]).toEqual(Object.keys(expect_data[0]));
      for (let i = 0; i < expect_data.length; i++) {
        expect(json.values[i + 1]).toEqual(Object.values(expect_data[i]));
      }
    });

    test('DBからレコードの取得に失敗した場合は例外をスローすること', async () => {
      // モック
      const mock_findMany = jest.fn().mockResolvedValue([]);
      spy_getDbClient.mockReturnValue({ articles_metadata: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await articlesMetadata(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(boom.notFound());
    });

    test('処理の過程で何らかのエラーが発生した場合は例外をスローすること', async () => {
      // ダミーデータ
      const dummy_error = new Error('TEST_error');

      // モック
      const mock_findMany = jest.fn().mockImplementation(() => {
        throw dummy_error;
      });
      spy_getDbClient.mockReturnValue({ articles_metadata: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
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
      const dummy_data = [
        {
          id: '80960c415a972219d8e1',
          data: 'data:image/webp;base64,UklGRlA4...',
        },
      ];
      const expect_data = JSON.parse(JSON.stringify(dummy_data));

      // モック
      const mock_findMany = jest.fn().mockResolvedValue(dummy_data);
      spy_getDbClient.mockReturnValue({ articles_pickup: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
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
      expect(json.values.length).toBe(expect_data.length + 1);
      expect(json.values[0]).toEqual(Object.keys(expect_data[0]));
      for (let i = 0; i < expect_data.length; i++) {
        expect(json.values[i + 1]).toEqual(Object.values(expect_data[i]));
      }
    });

    test('DBからレコードの取得に失敗した場合は例外をスローすること', async () => {
      // モック
      const mock_findMany = jest.fn().mockResolvedValue([]);
      spy_getDbClient.mockReturnValue({ articles_pickup: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await articlesPickup(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(boom.notFound());
    });

    test('処理の過程で何らかのエラーが発生した場合は例外をスローすること', async () => {
      // ダミーデータ
      const dummy_error = new Error('TEST_error');

      // モック
      const mock_findMany = jest.fn().mockImplementation(() => {
        throw dummy_error;
      });
      spy_getDbClient.mockReturnValue({ articles_pickup: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
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
      const dummy_data = [
        {
          last_update: '2020/01/01 3:00:00',
        },
      ];
      const expect_data = JSON.parse(JSON.stringify(dummy_data));

      // モック
      const mock_findMany = jest.fn().mockResolvedValue(dummy_data);
      spy_getDbClient.mockReturnValue({ version: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
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
      expect(json.values.length).toBe(expect_data.length + 1);
      expect(json.values[0]).toEqual(Object.keys(expect_data[0]));
      for (let i = 0; i < expect_data.length; i++) {
        expect(json.values[i + 1]).toEqual(Object.values(expect_data[i]));
      }
    });

    test('DBからレコードの取得に失敗した場合は例外をスローすること', async () => {
      // モック
      const mock_findMany = jest.fn().mockResolvedValue([]);
      spy_getDbClient.mockReturnValue({ version: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await version(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(boom.notFound());
    });

    test('処理の過程で何らかのエラーが発生した場合は例外をスローすること', async () => {
      // ダミーデータ
      const dummy_error = new Error('TEST_error');

      // モック
      const mock_findMany = jest.fn().mockImplementation(() => {
        throw dummy_error;
      });
      spy_getDbClient.mockReturnValue({ version: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await version(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
  });
});
