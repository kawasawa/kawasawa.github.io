# NOTE

## コマンド

開発時に使用する主なコマンドを以下に列挙する。  
アプリケーションの起動には `Node.js` ([.tool-versions](./.tool-versions)) , `Yarn`, `Docker` が必要になる。  
テストやビルドを含め、起動以外の部分まで完全に動作させる場合は、上記に加え `K6`, `tbls`, `Swagger Codegen` を導入する。

|                              | コマンド              | 概要                                                                                                                                                        |
| ---------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| パッケージのインストール     | `yarn install`        | 依存パッケージをインストールする                                                                                                                            |
| サービスのローカル起動       | `yarn dev`            | サービスをローカル環境で起動する                                                                                                                            |
| +-- フロントエンドのみ起動   | `yarn dev:app`        | フロントエンドの Web サーバのみ起動する<br/>(この場合、一部のコンテンツは表示されない)                                                                      |
| +-- バックエンドのみ起動     | `yarn dev:mock`       | バックエンドのモックサーバのみ起動する                                                                                                                      |
| 静的解析の実施               | `yarn lint`           | 静的解析を実施する                                                                                                                                          |
| 単体テストの実施             | `yarn test:ut`        | UT を実施し、`./app/coverage/` に Jest の実施結果を出力する<br/>UT を個別に実行したい場合は `yarn test:ut --testPathPattern 'path/to/test/\[id\].test.tsx'` |
| 結合テストの実施             | `yarn test:ita`       | IT を実施し、`./tools/dist/` に Newman の実施結果を出力する<br/>(モックサーバが起動している必要がある)                                                      |
| 性能テストの実施             | `yarn test:pt`        | 性能テストを実施し、`./tools/dist/` に K6 の実施結果を出力する<br/>(モックサーバが起動している必要がある)                                                   |
| 全資材をビルド               | `yarn build`          | 実行可能な形式のアプリケーションと関連するドキュメントを生成する                                                                                            |
| +-- アプリケーションのビルド | `yarn build:app`      | React.js アプリケーションをトランスパイルする                                                                                                               |
| +-- ライセンス情報の生成     | `yarn build:licenses` | React.js アプリケーションが利用するサードパーティーのライセンス情報を `./app/dist/` に出力する                                                              |
| +-- API 仕様書の生成         | `yarn build:openapi`  | OpenAPI 仕様書を HTML 形式で `./tools/dist/` に出力する                                                                                                     |
| +-- ER 図の生成              | `yarn build:er`       | 起動中の MySQL から ER 図を生成し `./tools/dist/` に出力する                                                                                                |

## 環境変数

アプリケーションのすべての機能を動作させるためには、下記の環境変数が必要になる。

- `✔︎`: 要設定 (`GitHub > Secrets > Actions` に登録する)
- `-`: 設定済 (環境変数ファイルに定義済み)
- `(空)`: 不要

| 変数名                                 | development | test | production | 概要                       |
| -------------------------------------- | ----------- | ---- | ---------- | -------------------------- |
| `REACT_APP_GOOGLEAPIS_URL`             | -           | -    | -          | API 処理のリクエスト先 URL |
| `REACT_APP_GOOGLE_SHEETS_API_KEY` (§1) | -           | -    | ✔          | Google Sheets の API キー  |
| `REACT_APP_GOOGLE_SHEETS_ID`           | -           | -    | ✔          | Google Sheets のシート ID  |
| `REACT_APP_GOOGLE_ANALYTICS_ID` (§2)   |             | -    | ✔          | Google Analytics ID        |
| `REACT_APP_EMAILJS_USER_ID` (§3)       |             | -    | ✔          | EmailJS のユーザ ID        |
| `REACT_APP_EMAILJS_SERVICE_ID`         |             | -    | ✔          | EmailJS のサービス ID      |
| `REACT_APP_EMAILJS_TEMPLATE_ID`        |             | -    | ✔          | EmailJS のテンプレート ID  |
| `REACT_APP_SENTRY_DSN` (§4)            |             |      | ✔          | Sentry のデータソース名    |
| `FOSSA_TOKEN` (§5)                     |             |      | ✔          | FOSSA の API トークン      |
| `SNYK_TOKEN` (§6)                      |             |      | ✔          | SNYK の API トークン       |
| `CODECOV_TOKEN` (§7)                   |             |      | ✔          | Codecov の API トークン    |
| `SLACK_WEBHOOK_URL` (§8)               |             |      | ✔          | Slack の Web フック URL    |

- $1: [Google Cloud: API キーを使用して認証する > API キーの制限を適用する](https://cloud.google.com/docs/authentication/api-keys?hl=ja&visit_id=637360038592927763-3730975888&rd=1#api_key_restrictions)  
  ※ 本番環境では HTTP リファラーと API が制限されたキーを使用すること
- $2: [Google: アナリティクスを設定 > トラッキング ID への対応](https://support.google.com/analytics/answer/9539598?hl=ja)
- §3: [EmailJS: emailjs.send](https://www.emailjs.com/docs/sdk/send/)
- §4: [Sentry: Data Source Name (DSN) > Where to Find Your DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/#where-to-find-your-dsn)
- §5: [FOSSA: API & Custom Integrations > API Tokens](https://docs.fossa.com/docs/api-reference#api-tokens)
- §6: [Snyk: Revoking and regenerating Snyk API tokens](https://docs.snyk.io/snyk-api-info/revoking-and-regenerating-snyk-api-tokens)
- §7: [Codecov: How to Set Up Codecov with C and GitHub Actions in 2022 > GitHub and Codecov](https://about.codecov.io/blog/how-to-set-up-codecov-with-c-and-github-actions/#github-and-codecov)
- §8: [Slack: Incoming Webhook](https://slack.com/services/new/incoming-webhook)

以上
