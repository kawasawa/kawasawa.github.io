#!/bin/bash

# MCPナレッジサーバーの実行スクリプト
# 依存関係を自動でインストールしてからPythonプログラムを実行します

set -e

# スクリプトのディレクトリに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# requirements.txtが存在する場合はインストールを実行
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies from requirements.txt..." >&2
    pip install -r requirements.txt --quiet
fi

# メインプログラムを実行（引数はそのまま渡す）
exec python3 main.py "$@"
