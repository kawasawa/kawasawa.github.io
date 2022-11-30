#!/bin/sh

# ******************************************************************************
# Terraform 作業ディレクトリセットアップ スクリプト
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

bucket_name="${project_short_name}-${environment}-terraform"
table_name="${project_short_name}-${environment}-terraform-lock"

# 実行前の確認
echo "Confirm settings:"
echo "  project_short_name: ${project_short_name}"
echo "  region: ${region}"
echo "  environment: ${environment}"
read -p "Do you want to continue? (y/N): " yn
case "$yn" in
  [yY]*) ;;
  *) echo "[INFO] Process aborted"; exit 1;;
esac

# Terraform リソース格納用バケットを作成
if aws s3api head-bucket --bucket ${bucket_name} 2>/dev/null; then
    echo "[INFO] Bucket ${bucket_name} already exists. Skipping creation."
else
    echo "[INFO] Creating bucket ${bucket_name}..."
    aws s3api create-bucket \
        --bucket ${bucket_name} \
        --region ${region} \
        --create-bucket-configuration LocationConstraint=${region}

    # バケットのバージョニングを有効化
    aws s3api put-bucket-versioning \
        --bucket ${bucket_name} \
        --versioning-configuration Status=Enabled

    # リソース作成が完了するまでにラグがあるため時間を置く
    for i in {10..1}; do
        echo "\rWaiting... $i seconds remaining"
        sleep 1
    done
fi

# 競合ロック用テーブルを作成
if aws dynamodb describe-table --table-name ${table_name} --region ${region} 2>/dev/null; then
    echo "[INFO] Table ${table_name} already exists. Skipping creation."
else
    echo "[INFO] Creating DynamoDB table ${table_name}..."
    aws dynamodb create-table \
        --table-name ${table_name} \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
        --region ${region}

    for i in {10..1}; do
        echo "\rWaiting... $i seconds remaining"
        sleep 1
    done
fi

# 開発端末のセットアップ
# モジュールの解析、プラグインの追加、.tfstate の取得が行われ、.terraform ディレクトリに整理される
echo "[INFO] Initialize Terraform ..."
terraform init \
    -backend-config="bucket=${bucket_name}" \
    -backend-config="dynamodb_table=${table_name}" \
    -backend-config="region=${region}"
