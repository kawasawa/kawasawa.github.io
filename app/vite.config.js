import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import envCompatible from 'vite-plugin-env-compatible';
// import { VitePWA } from 'vite-plugin-pwa';

// import manifest from './public/manifest.json';

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
    // PWA 対応用プラグイン
    // HACK: VitePWA によりサブディレクトリへのアクセスがルートにリダイレクトされるためコメントアウト
    // 通常の開発では問題ないと思われるが、GitHub Pages で他の Web アプリをサブディレクトリにデプロイしており相性が悪い
    //VitePWA({
    //  registerType: 'autoUpdate',
    //  includeAssets: ['favicon.ico'],
    //  manifest,
    //}),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
    port: 3000,
  },
});
