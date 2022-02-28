import { distinct, maxBy } from '@/utils/array';

describe('array', () => {
  describe('distinct', () => {
    it('重複のある値を格納した配列が渡された場合、一意の値を抽出した配列を返却すること', () => {
      const data = [1, 2, 2, 3, 3, 3];
      const unique = distinct(data);
      expect(unique).toEqual([1, 2, 3]);
    });

    it('一意な値のみを格納した配列が渡された場合、すべての値を抽出した配列を返却すること', () => {
      const data = [1, 2, 3, 4, 5, 6];
      const unique = distinct(data);
      expect(unique).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('空の配列が渡された場合、空の配列を返却すること', () => {
      expect(distinct([])).toEqual([]);
    });
  });

  describe('maxBy', () => {
    test('オブジェクトの配列が渡された場合、セレクタで指定されたプロパティが最大値を持つ要素を返却すること', () => {
      const data = [{ key: 1 }, { key: 3 }, { key: 2 }];
      const result = maxBy(data, (value) => value.key);
      expect(result).toEqual({ key: 3 });
    });

    test('オブジェクトが負の数を格納する場合、それらの中で最大値を持つ要素を返却すること', () => {
      const data = [{ key: -1 }, { key: -3 }, { key: -2 }];
      const result = maxBy(data, (value) => value.key);
      expect(result).toEqual({ key: -1 });
    });

    test('一つの要素のみを格納した配列が渡された場合、その唯一の要素を返却すること', () => {
      const data = [{ key: 1 }];
      const result = maxBy(data, (value) => value.key);
      expect(result).toEqual({ key: 1 });
    });

    test('空の配列が渡された場合、undefined を返却すること', () => {
      expect(maxBy([], (value) => value)).toBeUndefined();
    });
  });
});
