---
applyTo: "**/*.test.ts*"
description: "TypeScript のテストコードを実装する際のガイドラインを示すカスタムインストラクションです。"
---

# カスタムインストラクション

テストコードを実装する際は、以下のガイドラインに従ってください。

## コーディング規約

- ガイドライン ( #file:../instructions/global.instructions.md ) を遵守すること
- テストフレームワークは Jest を使用すること ( #file:../../app/package.json 参照)
- テストを実行するは `yarn test:ut <テストファイルのパス>` を実行すること
- 製品コードの修正は原則禁止だが、例外として `data-testid` 属性の追加のみ許可する
- MUI (旧 Material UI) のモックは作成不要とする (費用対効果が低いため)
