/**
 * シーケンスから一意の要素を抽出し、配列で返却します。
 * @param source 対象のシーケンス
 * @returns 一意の要素を格納する配列
 */
export const distinct = <T>(source: T[]) => Array.from(new Set(source));

/**
 * 指定したキー セレクター関数に従って、ジェネリック シーケンス内の最大値を返します。
 *
 * C# の `System.Linq.Enumerable.MaxBy` メソッドに相当する処理です。
 * see: https://learn.microsoft.com/ja-jp/dotnet/api/system.linq.enumerable.maxby
 * @param source 最大値を確認する対象となる値のシーケンス
 * @param keySelector 各要素のキーを抽出する関数
 * @returns シーケンス内の最大キーを持つ値
 */
export const maxBy = <T>(source: T[], keySelector: (value: T) => number): T | undefined => {
  if (source.length === 0) return undefined;
  return source.reduce((previousValue, currentValue) =>
    keySelector(currentValue) > keySelector(previousValue) ? currentValue : previousValue
  );
};
