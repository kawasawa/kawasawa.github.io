# NOTE: AWS のセキュリティグループは通信の許可ルールを構築する
# ファイアウォールに相当する概念で、インバウンドとアウトバウンドの通信を制御する
# VPC 内のリソースについては付与が必須で、ALB のほか EC2 や ECS, RDS, Lambda などがこれに当たる
# 一方で AWS がグローバルに管理する S3 SNS, ECR, Route53 などは不要である
# これらはセキュリティグループではなくアクセスポリシーで管理される
# また、セキュリティグループに類似する仕組みとして ネットワーク ACL も存在し、こちらはサブネットに適用するものである

# インバウンドルールを通過した通信はアウトバンドルールの定義に依らずレスポンスが許可される
# see: https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/security-group-connection-tracking.html
# `セキュリティグループのアウトバウンドルールにかかわらず、インバウンドトラフィックに対するレスポンスがインスタンスから送信されることを許可することを意味します。`

resource "aws_security_group" "alb" {
  vpc_id = var.vpc_main_id
  name   = "${var.prefix}-alb-sg"
  tags   = { Name = "${var.prefix}-alb-sg" }

  # HTTP でのインバウンドを許可
  ingress {
    protocol    = "tcp"         # HTTP/HTTPS は TCP プロトコルで転送される
    from_port   = 80            # HTTP のポート番号
    to_port     = 80            # HTTP のポート番号
    cidr_blocks = ["0.0.0.0/0"] # 全世界からのアクセスを許可する

    # インバウンドルールでアクセスを制限する場合は IP アドレス (cidr_blocks) ではなく security_groups を指定すると良い
    # ECS や RDS のセキュリティグループは、この ALB のセキュリティグループ (に属するインスタンス) に制限している
    # cidr_blocks での制限も可能だが、サブネットの cidr を指定すると予期せぬリソースからのアクセスもあり得るためリスクとなる
    # ただし ALB は全てのインバウンドを許可するため cidr_blocks で 0.0.0.0/0 を指定している
  }

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
