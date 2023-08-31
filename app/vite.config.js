import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [
    // React プロジェクト用 Vite プラグイン
    react(),
    // エイリアスの解決方法を tsconfig に準拠する
    tsconfigPaths(),
    // 環境変数の解決方法を React の方式に寄せる
    envCompatible({
      mountedPath: 'process.env',
      prefix: 'REACT_APP_',
    }),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
    port: 3000,
  },
});
