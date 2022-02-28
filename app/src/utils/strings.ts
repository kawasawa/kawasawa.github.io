/**
 * 指定した文字列内の書式指定項目を、指定した配列内の対応する文字列に置き換えます。
 * @param format 書式指定項目を含む文字列
 * @param args 書式設定する文字列の配列
 * @returns 書式指定項目を置き換えられた文字列
 */
export const stringFormat = (str: string, ...args: string[]) => {
  let result = str;
  for (let i = 0; i < args.length; i++) result = result.replace(`{${i}}`, args[i]);
  return result;
};
