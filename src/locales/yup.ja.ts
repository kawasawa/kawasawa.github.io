/* istanbul ignore file */

import * as Yup from 'yup';

Yup.setLocale({
  mixed: {
    default: '入力された内容にエラーがあります。',
    required: '入力が必須の項目です。',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    oneOf: ({ values }: { values: any }) => `次の値のいずれかで入力してください。: ${values}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notOneOf: ({ values }: { values: any }) => `次の値以外で入力してください。: ${values}`,
    notType: '有効な形式で入力してください。',
    defined: '項目が定義されていません。',
  },
  string: {
    length: ({ length }: { length: number }) => `${length}文字で入力してください。`,
    min: ({ min }: { min: number }) => `${min}文字以上で入力してください。`,
    max: ({ max }: { max: number }) => `${max}文字以内で入力してください。`,
    matches: '有効な形式で入力してください。',
    email: 'メールアドレス形式で入力してください。',
    url: 'URLの形式で入力してください。',
    uuid: 'UUIDの形式で入力してください。',
    trim: '前後に空白を含めずに入力してください。',
    lowercase: '小文字で入力してください。',
    uppercase: '大文字で入力してください。',
  },
  number: {
    min: ({ min }: { min: number }) => `${min}以上の数値で入力してください。`,
    max: ({ max }: { max: number }) => `${max}以下の数値で入力してください。`,
    lessThan: ({ less }: { less: number }) => `${less}より小さい数値で入力してください。`,
    moreThan: ({ more }: { more: number }) => `${more}より大きい数値で入力してください。`,
    positive: '正の数で入力してください。',
    negative: '負の数で入力してください。',
    integer: '整でを入力してください。',
  },
  date: {
    min: ({ min }: { min: Date | string }) => `${min}以上の日付で入力してください。`,
    max: ({ max }: { max: Date | string }) => `${max}以下の日付で入力してください。`,
  },
  array: {
    length: ({ length }: { length: number }) => `${length}個で入力してください。`,
    min: ({ min }: { min: number }) => `${min}個以上で入力してください。`,
    max: ({ max }: { max: number }) => `${max}個以下で入力してください。`,
  },
  boolean: {
    isValue: '入力された内容にエラーがあります。',
  },
  object: {
    noUnknown: '有効なキーを持ったデータを入力してください。',
  },
});

export default Yup;
