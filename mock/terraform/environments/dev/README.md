事前に下記を手動で実施する。

1. Route 53 で独自ドメインを取得
   - NS レコードと SOA レコードを登録
   - variables.tf にドメインを設定
2. ACM で SSL 証明書を発行
   - CNAME レコードを登録
   - variables.tf に ACM の ARN を設定
