import { isDevelopment, isProduction, isTest } from '@/utils/env';

describe('env', () => {
  afterEach(() => {
    (process.env.NODE_ENV as any) = 'test';
  });

  describe('isProduction', () => {
    test('Productionでの実行を判別できること', async () => {
      (process.env.NODE_ENV as any) = 'production';
      expect(isProduction()).toBe(true);
      (process.env.NODE_ENV as any) = 'development';
      expect(isProduction()).toBe(false);
      (process.env.NODE_ENV as any) = 'test';
      expect(isProduction()).toBe(false);
    });
  });

  describe('isDevelopment', () => {
    test('Developmentでの実行を判別できること', async () => {
      (process.env.NODE_ENV as any) = 'production';
      expect(isDevelopment()).toBe(false);
      (process.env.NODE_ENV as any) = 'development';
      expect(isDevelopment()).toBe(true);
      (process.env.NODE_ENV as any) = 'test';
      expect(isDevelopment()).toBe(false);
    });
  });

  describe('isTest', () => {
    test('Testでの実行を判別できること', async () => {
      (process.env.NODE_ENV as any) = 'production';
      expect(isTest()).toBe(false);
      (process.env.NODE_ENV as any) = 'development';
      expect(isTest()).toBe(false);
      (process.env.NODE_ENV as any) = 'test';
      expect(isTest()).toBe(true);
    });
  });
});
