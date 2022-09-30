#!/bin/sh

# ******************************************************************************
# Terraform リソース設定適用 スクリプト
# ******************************************************************************

# NOTE: Terraform は自動でリソースの作成、更新、削除を判断し、適用する
#   terraform plan でリソースの差分を検出し、集計することができる
#
#   コマンド実行結果にも書かれているが、シンボルには下記の意味がある
#     ```
#     Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
#       + create
#       ~ update in-place
#       - destroy
#     -/+ destroy and then create replacement
#     ```
#
#   それぞれ概要を説明する
#     xxx will be created
#       操作: 新規作成
#       停止期間: 無し
#     xxx will be updated in-place
#       操作: 更新
#       停止期間: 概ね無し (リソースの再起動が伴う場合は発生する)
#       例: セキュリティグループの付け替え、ディスクサイズの拡張 など
#     xxx will be destroyed
#       操作: 削除
#       停止期間: 有り (というか削除されるので使えなくなる)
#     xxx must be replaced
#       操作: 削除して再作成
#       停止期間: 有り
#       例: EC2 の OS イメージ (AMI) の変更、RDS の DB エンジンの変更 など (terraform plan で `force replacement` と赤で表示される)
#
#   これらを集計した結果が最後に出力される
#     ```
#     Plan: X to add, Y to change, Z to destroy.
#     ````
#     add    : `+` の数の合計値で、新しく作成されるリソース数を示す
#     change : `~` の数を合計値で、更新される既存リソース数を示す
#     destroy: `-` の数を合計値で、削除される既存リソース数を示す (赤で表示されるため分かると思う)


# クリーンアップ
cleanup() {
    if [ -f "tfplan" ]; then
        echo ""
        echo "[INFO] Cleaning up plan file..."
        rm -f tfplan
    fi
}
trap cleanup EXIT

# ------------------------------------------------------------------------------

# 環境選択
while true; do
    read -p "Enter the target environment (dev/stg/prd): " environment
    case $environment in
        dev|stg|prd) echo "[INFO] Selected environment: ${environment}"; break;;
        *) echo "[ERROR] Invalid environment. Please enter one of: dev, stg, prd";;
    esac
done
cd ./environments/${environment}

# 妥当性検証
echo "[INFO] Running terraform validate ..."
if ! terraform validate; then
    echo "[ERROR] terraform validate failed."
    exit 1
fi

# 差分検出
echo "[INFO] Running terraform plan ..."
PLAN_OUTPUT=$(mktemp)
terraform plan -detailed-exitcode -out=tfplan
PLAN_EXIT_CODE=$?
if [ $PLAN_EXIT_CODE -eq 1 ]; then
    echo "[ERROR] terraform plan failed."
    exit 1
fi
if [ $PLAN_EXIT_CODE -eq 0 ]; then
    echo "[INFO] No changes detected."
    exit 0
fi

read -p "Do you want to continue? (y/N): " yn
case "$yn" in
  [yY]*) ;;
  *)
    echo "[INFO] Process aborted."
    exit 0
    ;;
esac

# 設定反映
echo "[INFO] Running terraform apply ..."
if ! terraform apply -auto-approve tfplan; then
    echo "[ERROR] terraform apply failed."
    exit 1
fi

echo "[INFO] Deployment completed successfully."
