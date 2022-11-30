#!/bin/sh

# ******************************************************************************
# AWS シークレット取得 スクリプト
# ******************************************************************************

project_short_name="kawasawa"
region="ap-northeast-1"
environment=$(basename "$(dirname "$(realpath "$0")")")

# 踏み台サーバの秘密鍵を .ssh に保存
echo "[INFO] Get bastion key ..."
bastion_secret_id="${project_short_name}-${environment}-bastion-secret"
aws secretsmanager get-secret-value --secret-id ${bastion_secret_id} | jq -r .SecretString > ~/.ssh/${bastion_secret_id}.pem
