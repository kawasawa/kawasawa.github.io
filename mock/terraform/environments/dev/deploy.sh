#!/bin/sh

# ******************************************************************************
# Terraform リソースデプロイ スクリプト
# ******************************************************************************

echo "[INFO] Running terraform validate ..."
if ! terraform validate; then
    echo "[ERROR] terraform validate failed."
    exit 1
fi

echo "[INFO] Running terraform plan ..."
if ! terraform plan; then
    echo "[ERROR] terraform plan failed."
fi

read -p "Do you want to continue? (y/N): " yn
case "$yn" in
  [yY]*) ;;
  *) echo "[INFO] Process aborted"; exit 1;;
esac

echo "[INFO] Running terraform apply ..."
if ! terraform apply -auto-approve; then
    echo "[ERROR] terraform apply failed."
fi
