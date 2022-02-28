import httpMocks from 'node-mocks-http';

import { index } from './health';

describe('health', () => {
  describe('index', () => {
    test('ステータスコードが 200 であり success: true が内包されていること', async () => {
      // メソッドを実行
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      await index(req, res);

      // ステータスコードを確認
      expect(res.statusCode).toBe(200);

      // レスポンスデータを確認
      const jsonResponse = res._getJSONData();
      expect(jsonResponse).toEqual({ success: true });
    });
  });
});
