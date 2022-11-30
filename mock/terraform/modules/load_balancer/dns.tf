# NOTE: DNS レコードはドメインに関する設定を保持する
# DNS レコードにはいくつか種類があり下記に一例を示す
# これらのレコードを一つに纏めたものが所謂 "ゾーンファイル" である
#   - NS  (Name Server)
#       権威 DNS サーバ (対象のドメインに関する情報を管理するサーバ) を記録する
#   - SOA (Start of Authority)
#       権威 DNS サーバのゾーン (管理対象のドメイン全体) の管理情報を記録する
#       管理者の連絡先やプライマリーサーバ、情報の更新間隔に関する情報が含まれる
#       (当然 DNS サーバは複数台で動いており、互いに最新情報を交換し合っている)
#   - CNAME (Canonical Name)
#       指定のドメインと別の異なるドメインとの紐づけ (エイリアス) を記録する
#       AWS では ACM が世界中からのリクエストを一元管理するため、独自のドメイン `xxx.acm-validations.aws` を用意している
#       SSL 証明書を発行した際 ACM が Route 53 に CNAME レコードの追加を促すのはこのためである
#       AWS はこの CNAME レコードを通じて、指定のドメインの正常性を定期的に確認しているらしい
#   - A (Address)
#       ドメイン名と IPv4 アドレスとの紐付けを記録する
#       AWS では宛先に ALB 等の AWS リソースを指定して使われている
#       (紐付け先が IPv6 アドレスの場合は AAAA レコードを使用する)

# Route 53 でドメインの取得した際に NS と SOA が、ACM で SSL 証明書を発行した際に CNAME が追加される
# その後、ALB でドメインを使用した通信を行うため A レコードを追加する

resource "aws_route53_record" "alb" {
  zone_id = var.dns_zone_id
  name    = local.dns_record_name
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}
