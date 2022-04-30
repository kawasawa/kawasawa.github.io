# Express.js モックサーバ

開発環境様にバックエンドとして動作する Express.js 製のモックサーバを構築している。

## 技術情報

### 技術スタック

| 種別             | 使用技術                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------- |
| 開発言語         | [TypeScript](https://www.typescriptlang.org/)                                               |
| フレームワーク   | [Express.js](https://expressjs.com/)                                                        |
| バリデーター     | [Yup](https://github.com/jquense/yup/)                                                      |
| ロガー           | [morgan](https://github.com/expressjs/morgan/)                                              |
| エラーハンドラ   | [boom](https://github.com/hapijs/boom/)                                                     |
| セキュリティ対策 | [helmet](https://github.com/helmetjs/helmet/), [csurf](https://github.com/expressjs/csurf/) |
| OR マッパー      | [Sequelize](https://sequelize.org/)                                                         |
| データベース     | [MySQL](https://www.mysql.com/)                                                             |

## 開発情報

### コマンド

個別での実行も可能だが、基本は Makefile に記載の docker compose コマンドによって操作される想定である。

|                        | コマンド       | 概要                                     |
| ---------------------- | -------------- | ---------------------------------------- |
| サービスのローカル起動 | `yarn dev`     | サービスをローカル環境で起動する         |
| サービスの起動         | `yarn start`   | ビルド済みの資材を使いサービスを起動する |
| 静的解析の実施         | `yarn lint`    | 静的解析を実施する                       |
| 単体テストの実施       | `yarn test:ut` | UT を実施する                            |
| ビルドの実施           | `yarn build`   | ソースファイルを JS にトランスパイルする |

以上
