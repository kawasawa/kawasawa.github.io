import boom from '@hapi/boom';
import httpMocks from 'node-mocks-http';

import * as Prisma from '../lib/prisma';
import {
  articlesMetadata,
  articlesPickup,
  careerDetails,
  careers,
  certifications,
  icons,
  productImages,
  products,
  sns,
  version,
} from './spreadsheets';

// allow redefine
jest.mock('../lib/prisma', () => ({
  getDbClient: jest.fn(),
}));

describe('spreadsheets', () => {
  const spy_getDbClient = jest.spyOn(Prisma, 'getDbClient');

  beforeEach(() => {
    spy_getDbClient.mockClear();
  });

  describe('icons', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = [
        {
          id: 'dummy',
          data: 'https://example.com/badge/-Dummy-123456.svg?logo=dummy&style=flat',
        },
      ];
      const expect_data = JSON.parse(JSON.stringify(dummy_data));

      // モック
      const mock_findMany = jest.fn().mockResolvedValue(dummy_data);
      spy_getDbClient.mockReturnValue({ icons: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await icons(req, res, next);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();

      // レスポンスデータを確認
      const json = res._getJSONData();
      expect(Object.keys(json).length).toBe(3);
      expect(json.range).toBe("'icons'!A1:Z1000");
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
      spy_getDbClient.mockReturnValue({ icons: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await icons(req, res, next);

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
      spy_getDbClient.mockReturnValue({ icons: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await icons(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
  });

  describe('products', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = [
        {
          id: 1,
          title_ja_jp: 'MyPad',
          title_en_us: 'MyPad',
          subject_ja_jp: 'Modern Text Editor',
          subject_en_us: 'Modern Text Editor',
          body_ja_jp:
            '"毎日使うものこそ、美しく便利なものを..." そんな想いで作られたテキストエディタが MyPad です。視認性に優れるモダンな外観に、使い慣れたクラシックな操作性を兼ね備え、様々な用途にご利用頂けます。',
          body_en_us:
            '"Something you use every day should be beautiful and useful..." MyPad is a text editor created with this in mind. MyPad combines a modern, highly readable appearance with familiar, classic operability, and can be used for a variety of purposes.',
          skills: 'csharp, dotnet, wpf, prism, mahapps, win32, wap',
          url_code: 'https://github.com/kawasawa/MyPad',
          url_home: 'https://apps.microsoft.com/store/detail/9PP2600ZM2JD',
          downloads: 4000,
          pickup: true,
          visible: true,
        },
        {
          id: 2,
          title_ja_jp: 'ひより',
          title_en_us: 'HIYORI',
          subject_ja_jp: 'Weather Forecast',
          subject_en_us: 'Weather Forecast',
          body_ja_jp:
            '"気象情報を一覧できる Web サイトです。現在位置における直近から数日先までの三時間ごとの天気、気温、湿度、風の情報をまとめて確認できます。',
          body_en_us:
            'This Web site provides a list of weather information. You can check the weather, temperature, humidity, and wind information for the last three hours at your current location and for the next few days.',
          skills: 'typescript, reactjs, mui, pwa, leaflet',
          url_code: 'https://github.com/kawasawa/hiyori',
          url_home: 'https://kawasawa.github.io/hiyori',
          downloads: '',
          pickup: false,
          visible: false,
        },
      ];
      const expect_data = [
        {
          id: 1,
          'title_ja-JP': 'MyPad',
          'title_en-US': 'MyPad',
          'subject_ja-JP': 'Modern Text Editor',
          'subject_en-US': 'Modern Text Editor',
          'body_ja-JP':
            '"毎日使うものこそ、美しく便利なものを..." そんな想いで作られたテキストエディタが MyPad です。視認性に優れるモダンな外観に、使い慣れたクラシックな操作性を兼ね備え、様々な用途にご利用頂けます。',
          'body_en-US':
            '"Something you use every day should be beautiful and useful..." MyPad is a text editor created with this in mind. MyPad combines a modern, highly readable appearance with familiar, classic operability, and can be used for a variety of purposes.',
          skills: 'csharp, dotnet, wpf, prism, mahapps, win32, wap',
          url_code: 'https://github.com/kawasawa/MyPad',
          url_home: 'https://apps.microsoft.com/store/detail/9PP2600ZM2JD',
          downloads: 4000,
          pickup: 'true',
          visible: 'true',
        },
        {
          id: 2,
          'title_ja-JP': 'ひより',
          'title_en-US': 'HIYORI',
          'subject_ja-JP': 'Weather Forecast',
          'subject_en-US': 'Weather Forecast',
          'body_ja-JP':
            '"気象情報を一覧できる Web サイトです。現在位置における直近から数日先までの三時間ごとの天気、気温、湿度、風の情報をまとめて確認できます。',
          'body_en-US':
            'This Web site provides a list of weather information. You can check the weather, temperature, humidity, and wind information for the last three hours at your current location and for the next few days.',
          skills: 'typescript, reactjs, mui, pwa, leaflet',
          url_code: 'https://github.com/kawasawa/hiyori',
          url_home: 'https://kawasawa.github.io/hiyori',
          downloads: '',
          pickup: 'false',
          visible: 'false',
        },
      ];

      // モック
      const mock_findMany = jest.fn().mockResolvedValue(dummy_data);
      spy_getDbClient.mockReturnValue({ products: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await products(req, res, next);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();

      // レスポンスデータを確認
      const json = res._getJSONData();
      expect(Object.keys(json).length).toBe(3);
      expect(json.range).toBe("'products'!A1:Z1000");
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
      spy_getDbClient.mockReturnValue({ products: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await products(req, res, next);

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
      spy_getDbClient.mockReturnValue({ products: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await products(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
  });

  describe('productImages', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = [
        {
          product_id: 1,
          row_no: 2,
          data: 'data:image/webp;base64,UklGRlA4...',
        },
      ];
      const expect_data = JSON.parse(JSON.stringify(dummy_data));

      // モック
      const mock_findMany = jest.fn().mockResolvedValue(dummy_data);
      spy_getDbClient.mockReturnValue({ product_images: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await productImages(req, res, next);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();

      // レスポンスデータを確認
      const json = res._getJSONData();
      expect(Object.keys(json).length).toBe(3);
      expect(json.range).toBe("'product-images'!A1:Z1000");
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
      spy_getDbClient.mockReturnValue({ product_images: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await productImages(req, res, next);

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
      spy_getDbClient.mockReturnValue({ product_images: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await productImages(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
  });

  describe('careers', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = [
        {
          id: 1,
          date: '2014-03',
          place: 'Yamanashi',
          title_ja_jp: '山梨大学 工学部 卒業',
          title_en_us: 'University of Yamanashi',
          favicon: 'https://www.yamanashi.ac.jp/favicon.ico',
          url: 'https://www.yamanashi.ac.jp/',
          visible: true,
        },
        {
          id: 2,
          date: '2014-04',
          place: 'Yamanashi',
          title_ja_jp: '株式会社 YSK e-com',
          title_en_us: 'YSK e-com Co., Ltd.',
          favicon: 'https://www.ysk.co.jp/favicon.ico',
          url: 'https://www.ysk.co.jp/',
          visible: false,
        },
      ];
      const expect_data = [
        {
          id: 1,
          date: '2014-03',
          place: 'Yamanashi',
          'title_ja-JP': '山梨大学 工学部 卒業',
          'title_en-US': 'University of Yamanashi',
          favicon: 'https://www.yamanashi.ac.jp/favicon.ico',
          url: 'https://www.yamanashi.ac.jp/',
          visible: 'true',
        },
        {
          id: 2,
          date: '2014-04',
          place: 'Yamanashi',
          'title_ja-JP': '株式会社 YSK e-com',
          'title_en-US': 'YSK e-com Co., Ltd.',
          favicon: 'https://www.ysk.co.jp/favicon.ico',
          url: 'https://www.ysk.co.jp/',
          visible: 'false',
        },
      ];

      // モック
      const mock_findMany = jest.fn().mockResolvedValue(dummy_data);
      spy_getDbClient.mockReturnValue({ careers: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await careers(req, res, next);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();

      // レスポンスデータを確認
      const json = res._getJSONData();
      expect(Object.keys(json).length).toBe(3);
      expect(json.range).toBe("'careers'!A1:Z1000");
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
      spy_getDbClient.mockReturnValue({ careers: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await careers(req, res, next);

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
      spy_getDbClient.mockReturnValue({ careers: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await careers(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
  });

  describe('careerDetails', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = [
        {
          career_id: 1,
          row_no: 1,
          subject_ja_jp: 'コンピュータサイエンスを専攻',
          subject_en_us: 'Majoring in Computer Science',
          skills: 'cpp, csharp, dotnetfw, mono, gtkmm, opengl, emacs, xampp',
        },
      ];
      const expect_data = [
        {
          career_id: 1,
          row_no: 1,
          'subject_ja-JP': 'コンピュータサイエンスを専攻',
          'subject_en-US': 'Majoring in Computer Science',
          skills: 'cpp, csharp, dotnetfw, mono, gtkmm, opengl, emacs, xampp',
        },
      ];

      // モック
      const mock_findMany = jest.fn().mockResolvedValue(dummy_data);
      spy_getDbClient.mockReturnValue({ career_details: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await careerDetails(req, res, next);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();

      // レスポンスデータを確認
      const json = res._getJSONData();
      expect(Object.keys(json).length).toBe(3);
      expect(json.range).toBe("'career-details'!A1:Z1000");
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
      spy_getDbClient.mockReturnValue({ career_details: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await careerDetails(req, res, next);

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
      spy_getDbClient.mockReturnValue({ career_details: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await careerDetails(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
  });

  describe('certifications', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = [
        {
          id: 1,
          date: '2012-05',
          title_ja_jp: '基本情報技術者',
          title_en_us: 'Fundamental Information Technology Engineer',
          subject_ja_jp: '情報処理推進機構',
          subject_en_us: 'Information-technology Promotion Agency',
          favicon: 'https://www.ipa.go.jp/favicon.ico',
          url: 'https://www.ipa.go.jp/shiken/kubun/fe.html',
          visible: true,
        },
        {
          id: 2,
          date: '2014-12',
          title_ja_jp: '応用情報技術者',
          title_en_us: 'Applied Information Technology Engineer',
          subject_ja_jp: '情報処理推進機構',
          subject_en_us: 'Information-technology Promotion Agency',
          favicon: 'https://www.ipa.go.jp/favicon.ico',
          url: 'https://www.ipa.go.jp/shiken/kubun/ap.html',
          visible: false,
        },
      ];
      const expect_data = [
        {
          id: 1,
          date: '2012-05',
          'title_ja-JP': '基本情報技術者',
          'title_en-US': 'Fundamental Information Technology Engineer',
          'subject_ja-JP': '情報処理推進機構',
          'subject_en-US': 'Information-technology Promotion Agency',
          favicon: 'https://www.ipa.go.jp/favicon.ico',
          url: 'https://www.ipa.go.jp/shiken/kubun/fe.html',
          visible: 'true',
        },
        {
          id: 2,
          date: '2014-12',
          'title_ja-JP': '応用情報技術者',
          'title_en-US': 'Applied Information Technology Engineer',
          'subject_ja-JP': '情報処理推進機構',
          'subject_en-US': 'Information-technology Promotion Agency',
          favicon: 'https://www.ipa.go.jp/favicon.ico',
          url: 'https://www.ipa.go.jp/shiken/kubun/ap.html',
          visible: 'false',
        },
      ];

      // モック
      const mock_findMany = jest.fn().mockResolvedValue(dummy_data);
      spy_getDbClient.mockReturnValue({ certifications: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await certifications(req, res, next);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();

      // レスポンスデータを確認
      const json = res._getJSONData();
      expect(Object.keys(json).length).toBe(3);
      expect(json.range).toBe("'certifications'!A1:Z1000");
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
      spy_getDbClient.mockReturnValue({ certifications: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await certifications(req, res, next);

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
      spy_getDbClient.mockReturnValue({ certifications: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await certifications(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
  });

  describe('sns', () => {
    test('レコードの取得に成功し、ジャグ配列として返却されること', async () => {
      // ダミーデータ
      const dummy_data = [
        {
          id: 1,
          title_ja_jp: 'Twitter',
          title_en_us: 'Twitter',
          favicon: 'https://abs.twimg.com/favicons/twitter.2.ico',
          url: 'https://twitter.com/k_awasawa',
          visible: true,
        },
        {
          id: 2,
          title_ja_jp: 'はてなブログ',
          title_en_us: 'Hatena Blog',
          favicon: 'https://cdn.blog.st-hatena.com/images/favicon.png',
          url: 'https://https://kawasawa.hatenablog.com',
          visible: false,
        },
      ];
      const expect_data = [
        {
          id: 1,
          'title_ja-JP': 'Twitter',
          'title_en-US': 'Twitter',
          favicon: 'https://abs.twimg.com/favicons/twitter.2.ico',
          url: 'https://twitter.com/k_awasawa',
          visible: 'true',
        },
        {
          id: 2,
          'title_ja-JP': 'はてなブログ',
          'title_en-US': 'Hatena Blog',
          favicon: 'https://cdn.blog.st-hatena.com/images/favicon.png',
          url: 'https://https://kawasawa.hatenablog.com',
          visible: 'false',
        },
      ];

      // モック
      const mock_findMany = jest.fn().mockResolvedValue(dummy_data);
      spy_getDbClient.mockReturnValue({ sns: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await sns(req, res, next);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();

      // レスポンスデータを確認
      const json = res._getJSONData();
      expect(Object.keys(json).length).toBe(3);
      expect(json.range).toBe("'sns'!A1:Z1000");
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
      spy_getDbClient.mockReturnValue({ sns: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await sns(req, res, next);

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
      spy_getDbClient.mockReturnValue({ sns: { findMany: mock_findMany } } as unknown as any);

      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();
      await sns(req, res, next);

      // 外部メソッドの呼び出し状況を確認
      expect(mock_findMany).toBeCalled();
      expect(next).toBeCalledWith(dummy_error);
    });
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
