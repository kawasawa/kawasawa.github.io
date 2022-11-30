#!/bin/sh

# ******************************************************************************
# 踏み台サーバ 暗号化キー取得 スクリプト
# ******************************************************************************

project_short_name="kawasawa"
region="ap-northeast-1"

# 操作対象の環境を指定
while true; do
    read -p "Enter the target environment (dev/stg/prd): " environment
    case $environment in
        dev|stg|prd) echo "[INFO] Selected environment: ${environment}"; break;;
        *) echo "[ERROR] Invalid environment. Please enter one of: dev, stg, prd";;
    esac
done
cd ./environments/${environment}

# 踏み台サーバの秘密鍵を .ssh に保存
echo "[INFO] Get bastion key ..."
bastion_secret_id="${project_short_name}-${environment}-bastion-secret"
aws secretsmanager get-secret-value --secret-id ${bastion_secret_id} | jq -r .SecretString > ~/.ssh/${bastion_secret_id}.pem
