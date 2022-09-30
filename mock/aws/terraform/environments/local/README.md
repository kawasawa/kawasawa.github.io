下記を実施する。

1. LocalStack を起動

```:sh
cd mock/aws/
docker compose up -d
curl -s http://localhost:4566/_localstack/health | jq .
```

2. Terraform の実行確認

```:sh
cd mock/aws/terraform/environments/local
terraform init
terraform plan

# 無料プランで実行しているためエラーになるが途中までは確認できる
#   ECR, ECS, RDS, ELB, WAF は Base プラン以上で開放される
#   see: https://docs.localstack.cloud/aws/licensing/
terraform apply

# これも途中までは確認できる
#  おそらく削除の依存関係の問題で VPC エンドポイントが消せない
#  完全な AWS クローンではないためこの辺りは仕方ないと思われる
terraform destroy
```
