import { configKeys, getConfig, setConfig } from '@/utils/config';

describe('config', () => {
  const spy_getItem = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  const spy_setItem = jest.spyOn(Storage.prototype, 'setItem');

  beforeEach(() => {
    spy_getItem.mockClear();
    spy_setItem.mockClear();
  });

  describe('getConfig', () => {
    test('指定されたキーでローカルストレージから値を取得すること', async () => {
      spy_getItem.mockImplementation((key) => `item_${key}`);
      const value = getConfig(configKeys.locale);
      expect(value).toBe(`item_${configKeys.locale}`);
      expect(spy_getItem).toBeCalledWith(configKeys.locale);
    });
  });

  describe('setConfig', () => {
    test('指定されたキーでローカルストレージの値を更新すること', async () => {
      spy_setItem.mockImplementation(jest.fn());
      setConfig(configKeys.locale, 'dummy');
      expect(spy_setItem).toBeCalledWith(configKeys.locale, 'dummy');
    });
  });
});
