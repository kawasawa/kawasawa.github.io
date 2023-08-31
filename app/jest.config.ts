import { readFileSync } from 'fs';
import { parse } from 'jsonc-parser';
import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

const { compilerOptions } = parse(readFileSync('./tsconfig.json').toString());

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    // 画像ファイルとスタイルシートはインポートエラーになるためモックする
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.ts',
    '\\.(css|sass|scss|less)$': '<rootDir>/src/__mocks__/styleMock.ts',
    '^.+/css(/.+)?$': '<rootDir>/src/__mocks__/styleMock.ts',
    // tsconfig.json の paths と同じエイリアス設定を使用する
    ...pathsToModuleNameMapper(compilerOptions.paths),
  },
  coveragePathIgnorePatterns: ['/node_modules/', '__mocks__', '__it__'],
  coverageThreshold: {
    global: {
      statements: 95, // C0 カバレッジ
      branches: 85, // C1 カバレッジ
    },
  },
  testTimeout: 10000,
};

export default config;
