# MCP Knowledge Server

## 🚀 概要

MCP Knowledge Server は、ワークスペース内のコメントを検索・提供する Model Context Protocol (MCP) サーバです。このサーバにより、ワークスペース内のソースコードやスクリプトに含まれる指定のアノテーションコメントタグで始まるコメントを検索し、生成 AI が技術的な情報源として活用できるようになります。

## ✨ 特徴

- **キーワード検索**: 特定のキーワードでコメントを検索
- **全件取得**: ワークスペース内のアノテーションコメントを一覧表示
- **ファイル指定検索**: 特定ファイル内のコメントのみを取得
- **カテゴリ別分類**: ファイル拡張子別にコメントを分類
- **多言語対応**: 様々なプログラミング言語のコメント形式に対応
- **VS Code 統合**: GitHub Copilot など生成 AI との自動連携

## 🛠 使用方法

### 1. 直接実行

```bash
cd ~/repos/kawasawa.github.io/mcp/knowledge
python3 main.py --workspace ~/repos/kawasawa.github.io
```

### 2. カスタムタグで実行

```bash
cd ~/repos/kawasawa.github.io/mcp/knowledge
python3 main.py --workspace ~/repos/kawasawa.github.io --annotation_tag "HACK:"
```

### 3. VS Code MCP 設定に追加

`.vscode/mcp.json` に以下の設定を追加：

```json
{
  "servers": {
    "knowledge": {
      "command": "python3",
      "args": [
        "${workspaceFolder}/mcp/knowledge/main.py",
        "--workspace",
        "${workspaceFolder}"
      ]
    }
  }
}
```

⚠️ **絶対パスを使用する**: VS Code の MCP 設定では、必ず絶対パスを使用してください。相対パスを使用すると「No such file or directory」エラーが発生します。

### 4. 生成 AI での活用（推奨）

VS Code で生成 AI を使用する際に、自動的にコメントが参照可能になります。  
GitHub Copilot に以下のような質問をしてみてください：

例：

- 「React で useEffect を使う際の注意点は？」 → React 副作用に関する注意点の情報が参照される
- 「セキュリティ対策で気をつけることは？」 → XSS、CSRF、CORS に関する具体的な対策情報が参照される
- 「AWS のセキュリティグループってどう設定するの？」 → Terraform ファイル内の実際の設定知見が参照される
- 「MySQL の文字コード設定について教えて」 → 設定ファイル内の推奨設定と理由が参照される

セキュリティ学習、React 開発、AWS 構築などへの活用が期待できます。

### 5. コマンドラインでの検索

```bash
cd mcp/knowledge

# すべてのキーワードを確認
python3 -c "
from searcher import CommentSearcher
searcher = CommentSearcher('~/repos/kawasawa.github.io', 'NOTE:')
notes = searcher.search_all_notes()
for note in notes[:5]:
    print(f'{note[\"file_path\"]}:{note[\"line_number\"]} - {note[\"content\"]}')
"
```

### 6. MCP サーバとして直接利用

```bash
# サーバを起動
cd ~/repos/kawasawa.github.io/mcp/knowledge
python3 main.py --workspace ~/repos/kawasawa.github.io
```

```bash
# JSONリクエストを送信（例）
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_notes","arguments":{"keyword":"React"}}}' | python3 main.py --workspace ~/repos/kawasawa.github.io
```

## 🔧 利用可能なツール

### search_notes

指定のキーワードでコメントを検索します。

**パラメータ:**

- `keyword` (string): 検索キーワード

**例:**

```json
{
  "name": "search_notes",
  "arguments": {
    "keyword": "セキュリティ"
  }
}
```

### list_all_notes

ワークスペース内の対象の全コメントを一覧表示します。

**パラメータ:** なし

### get_notes_by_file

指定されたファイルの対象のコメントを取得します。

**パラメータ:**

- `file_path` (string): ファイルの相対パス

**例:**

```json
{
  "name": "get_notes_by_file",
  "arguments": {
    "file_path": "app/src/pages/Top.tsx"
  }
}
```

### get_notes_by_category

ファイル拡張子別に対象のコメントを分類して取得します。

**パラメータ:** なし

## ⚙️ 技術仕様

- **プロトコル**: Model Context Protocol (MCP) 2024-11-05
- **Python バージョン**: 3.10 以上
- **文字エンコーディング**: UTF-8

### 検索対象

サポートされるコメント形式、ファイル拡張子、除外されるディレクトリは `const.py` を参照してください。

### 制限事項

- バイナリファイルは検索対象外
- 大きなファイル（例: ログファイル）は処理が遅くなる可能性があります
- ファイル読み込みエラーは無視され、該当ファイルはスキップされます

## 🐛 トラブルシューティング

### よくある問題

1. **ファイルが見つからない**

   - ワークスペースパスが正しいか確認
   - ファイルが除外ディレクトリに含まれていないか確認

2. **文字化けが発生する**

   - ファイルが UTF-8 でエンコードされているか確認
   - エラーは無視されるため、ファイルはスキップされます

3. **検索結果が表示されない**
   - キーワードの大文字小文字を確認
   - ファイル拡張子が対象に含まれているか確認

### ログの確認

サーバーは標準エラー出力にログを出力します：

```bash
cd ~/repos/kawasawa.github.io/mcp/knowledge
python3 main.py --workspace ~/repos/kawasawa.github.io 2> server.log
```

## 📄 ライセンス

このプロジェクトのライセンスについては、ワークスペースのルートディレクトリにある `LICENSE.md` を参照してください。
