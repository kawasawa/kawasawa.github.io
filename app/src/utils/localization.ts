import i18n from 'i18next';
import * as yup from 'yup';

import { locale as enUsYup } from '@/locales/en-US.yup';
import { locale as jaJpYup } from '@/locales/js-JP.yup';

/**
 * ${language}-$region} の形式で定義されるロケールコードを表します。
 */
export const localeCodes = {
  jaJp: 'ja-JP',
  enUs: 'en-US',
} as const;

/**
 * ${language}-$region} の形式で定義されるロケールコードを表します。
 */
export type LocaleCodes = (typeof localeCodes)[keyof typeof localeCodes];

/**
 * ロケール名を表します。
 */
export const localeNames = {
  [`${localeCodes.jaJp}`]: '日本語',
  [`${localeCodes.enUs}`]: 'English',
} as const;

/**
 * 多言語表示に使用されるロケール情報を変更します。
 * @param localeCode ロケールコード
 */
export const changeLocale = (localeCode: LocaleCodes) => {
  switch (localeCode) {
    case localeCodes.enUs:
      i18n.changeLanguage(localeCode);
      yup.setLocale(enUsYup);
      break;
    default:
      i18n.changeLanguage(localeCodes.jaJp);
      yup.setLocale(jaJpYup);
      break;
  }
};

/**
 * yup モジュールを格納します。
 */
export const Yup = yup;

// ******************************************************************************
// 以下 初期化初期
// ******************************************************************************
yup.setLocale(jaJpYup);
