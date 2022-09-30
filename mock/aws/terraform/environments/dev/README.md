事前に下記を実施する。

1. Route 53 で独自ドメインを取得

   - NS レコードと SOA レコードを登録
   - variables.tf の dns_zone_id にドメインを記載

2. ACM で SSL 証明書を発行
   - CNAME レコードを登録
   - variables.tf の acm_arn_suffix に ACM の ARN のサフィックスを記載
