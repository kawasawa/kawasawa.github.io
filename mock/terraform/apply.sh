#!/bin/sh

# ******************************************************************************
# Terraform リソース設定適用 スクリプト
# ******************************************************************************

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
