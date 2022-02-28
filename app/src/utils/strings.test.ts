import { stringFormat } from '@/utils/strings';

describe('strings', () => {
  describe('stringFormat', () => {
    test('文字列を補完できること', async () => {
      const result = stringFormat('{0}, {1}, {2}', 'hoge', 'fuga', 'piyo');
      expect(result).toBe('hoge, fuga, piyo');
    });
  });
});
