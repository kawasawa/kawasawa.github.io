import * as i18n from 'i18next';
import * as yup from 'yup';

import { locale as enUsYup } from '@/locales/en-US.yup';
import { locale as jaJpYup } from '@/locales/js-JP.yup';
import { changeLocale, LocaleCodes, localeCodes } from '@/utils/localization';

jest.mock('i18next', () => ({
  ...jest.requireActual('i18next'),
  changeLanguage: jest.fn(),
}));

jest.mock('yup', () => ({
  ...jest.requireActual('yup'),
  setLocale: jest.fn(),
}));

describe('translation', () => {
  const spy_changeLanguage = jest.spyOn(i18n, 'changeLanguage');
  const spy_setLocale = jest.spyOn(yup, 'setLocale');

  beforeEach(() => {
    spy_changeLanguage.mockClear();
    spy_setLocale.mockClear();
  });

  describe('changeLocale', () => {
    test('指定されたロケール情報に更新されること', async () => {
      changeLocale(localeCodes.enUs);
      expect(spy_changeLanguage).toBeCalledWith(localeCodes.enUs);
      expect(spy_setLocale).toBeCalledWith(enUsYup);
    });

    test('日本を既定のロケール情報として更新されること', async () => {
      changeLocale('' as LocaleCodes);
      expect(spy_changeLanguage).toBeCalledWith(localeCodes.jaJp);
      expect(spy_setLocale).toBeCalledWith(jaJpYup);
    });
  });
});
