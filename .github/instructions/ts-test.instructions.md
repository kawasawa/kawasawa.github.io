---
applyTo: "**/*.test.*"
description: "TypeScript のテストコードを実装する際の規約"
---

# テストコードの規約

- ガイドライン ( #file:../copilot-instructions.md ) を遵守
- テストフレームワークは Jest を使用 ( #file:../../app/package.json 参照)
- テストコードとテスト対象は同一ディレクトリに配置
- MUI (Material UI) のモックは作成不要 (費用対効果が低い)
- 製品コードの修正は原則禁止、例外として `data-testid` 属性の追加のみ許可
- テストは `yarn test:ut <テストファイルのパス>` コマンドで実行
