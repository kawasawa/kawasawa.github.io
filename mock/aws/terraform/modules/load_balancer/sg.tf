# NOTE: AWS のセキュリティグループは通信の許可ルールを構築する
# ネットワーク層のファイアウォールに相当する概念で、インバウンドとアウトバウンドの通信を制御する
# VPC 内のリソースについては付与が必須で、ALB のほか EC2 や ECS, RDS, Lambda などがこれに当たる
# (一方で AWS がグローバルに管理する S3 SNS, ECR, Route53 などは不要である
#  これらはセキュリティグループではなくアクセスポリシーで管理される)
# また、セキュリティグループに類似する仕組みとして ネットワーク ACL も存在し、こちらはサブネットに適用するものである
# なお、 WAF はセキュリティグループとは違い、アプリケーション層のファイアウォールであり ALB 等に適用する
# セキュリティグループと WAF の両方が設定された場合、ネットワーク層で動作するセキュリティグループが先に評価され、リソースに到達する前にリクエストを遮断する
#   see: https://dev.classmethod.jp/articles/waf-alb_evaluation-sequence/
#     `ALB セキュリティグループ → WAF の順序で評価されます。`
#   see: https://iret.media/73638
#     `ALBのセキュリティグループで判定 → WAFで判定 → OKだったらEC2にリクエストという動きになる。`

# インバウンドルールを通過した通信はアウトバンドルールの定義に依らずレスポンスが許可される
#   see: https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/security-group-connection-tracking.html
#     `セキュリティグループのアウトバウンドルールにかかわらず、インバウンドトラフィックに対するレスポンスがインスタンスから送信されることを許可することを意味します。`

resource "aws_security_group" "alb" {
  vpc_id = var.vpc_main_id
  name   = "${var.prefix}-alb-sg"
  tags   = { Name = "${var.prefix}-alb-sg" }

  # HTTPS でのインバウンドを許可
  ingress {
    protocol  = "tcp" # HTTP/HTTPS は TCP プロトコルで転送される
    from_port = 443   # 許可するポート番号の範囲
    to_port   = 443   # 許可するポート番号の範囲
    # trivy:ignore:AVD-AWS-0107: すべての IP アドレスからのインバウンドを許可
    cidr_blocks = ["0.0.0.0/0"]

    # 通信プロトコル について
    #   初歩的だが、HTTPS や SSH は TCP プロトコルで送信される
    #   TCP はスリーウェイハンドシェイクでリクエスト元との接続を確立した上で通信を行う
    #   指定の IP アドレスで通信を制限できるのはこの仕組みによるものだ
    #   リクエスト元は自身の IP アドレスを偽装できるが、ハンドシェイクの ACK (応答) と SYN (接続要求) を受信できず通信が成立しない

    # ポート番号 について
    #   インバウンドルールはポート番号を from to の範囲で指定できる
    #   ただし、基本的には意図しない開放を防ぐため同一値 (=指定のポート番号のみ) とする場合が多い

    # IP アドレスの制限 について
    #   ここでは ALB は全てのインバウンドを許可するため cidr_blocks で 0.0.0.0/0 を指定している
    #   本来インバウンドルールでアクセスを制限する場合は IP アドレス (cidr_blocks) ではなく security_groups を指定する方が取り回ししやすい
    #   (cidr_blocks での制限も可能だが、サブネットの cidr を指定すると予期せぬリソースからのアクセスもあり得るためリスクとなる)
    #   なお、ECS や RDS のセキュリティグループは、インバウンドをこのセキュリティグループ (に属するインスタンス) に制限している
  }
  # 開発環境等で HTTP を使用する場合は下記
  # ingress {
  #   protocol    = "tcp"
  #   from_port   = 80
  #   to_port     = 80
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

  # ECS へのアウトバウンドを許可
  egress {
    protocol  = "tcp"                  # HTTP/HTTPS は TCP プロトコルで転送される
    from_port = var.app_port           # API サーバのポート番号
    to_port   = var.app_port           # API サーバのポート番号
    cidr_blocks = [                    # プライベートサブネット内への通信を許可する
      var.subnet_private_a_cidr_block, # プライベートサブネット (a)
      var.subnet_private_c_cidr_block, # プライベートサブネット (c)
    ]

    # このアウトバウンドルールでは、宛先を特定のリソースに限定せず、サブネット内に存在するリソース全てに対して通信を許可している
    # アウトバウンドは絞り過ぎると API や DNS などへの通信に支障が出ることもあり、基本的には開放する傾向がある
  }
}
