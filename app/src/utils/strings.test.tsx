import { extractAltText4ShieldsIo, stringFormat } from '@/utils/strings';

describe('strings', () => {
  describe('stringFormat', () => {
    test('文字列を補完できること', async () => {
      const result = stringFormat('{0}, {1}, {2}', 'hoge', 'fuga', 'piyo');
      expect(result).toBe('hoge, fuga, piyo');
    });
  });

  describe('extractAltText4ShieldsIo', () => {
    test('引数がshields.ioの形式に合致する場合、statusエリアの文字列が返却されること', () => {
      const status = 'status';
      const alt = extractAltText4ShieldsIo(`https://example.com/-${status}-ABCDEF.svg?logo=hoge&style=flat`);
      expect(alt).toBe(status);
    });

    test('引数がshields.ioの形式に合致しない場合、引数の文字列がそのまま返却されること', () => {
      const status = 'status';
      const alt = extractAltText4ShieldsIo(status);
      expect(alt).toBe(status);
    });
  });
});
