const { pathsToModuleNameMapper } = require('ts-jest');
const { parse } = require('jsonc-parser');
const { readFileSync } = require('fs');
const { compilerOptions } = parse(readFileSync('./tsconfig.json').toString());

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testTimeout: 10000,
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
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
