# ALB と NLB は動作するレイヤが異なる
# - ALB
#     レイヤ: アプリケーション層
#     プロトコル: HTTP, HTTPS
#     概要: リクエスト (URL, HTTP ヘッダー, クエリパラメータ) の詳細な情報に基づく複雑な振り分けが可能
#     用途: AP サーバ など
# - NLB
#     レイヤ: トランスポート層
#     プロトコル: TCP, TLS
#     概要: パケットの断片的な情報に基づく、IP アドレス指定 (Elastic IP) 等による高速な振り分けが可能
#     用途: DB サーバ など

# ------------------------------------------------------------------------------
# ロードバランサー
# ------------------------------------------------------------------------------

resource "aws_lb" "main" {
  load_balancer_type         = "application"
  name                       = "${var.prefix}-alb"
  tags                       = { Name = "${var.prefix}-alb" }
  drop_invalid_header_fields = true # リクエストに含まれる無効なヘッダーフィールドを除去する (AVD-AWS-0052 対応)

  # S3 にアクセスログを出力できるが、追加課金が発生するため無効化しておく
  # access_logs {
  #   enabled = true
  #   bucket  = var.prefix
  #   prefix  = "alb"
  # }

  subnets = [
    # ALB は最低 2 つ以上のサブネットに配置する
    # 内部的には各サブネットに ALB のリスナーが配置され、これによりトラフィックが受信できる状態になる
    var.subnet_public_a_id,
    var.subnet_public_c_id
  ]

  security_groups = [
    aws_security_group.alb.id,
  ]

  # trivy:ignore:AVD-AWS-0053: ロードバランサーへのパブリックアクセスを許可 (Web アプリのため意図的に公開されている、アクセス制限はセキュリティグループで実施する)
  internal = false
}

# ------------------------------------------------------------------------------
# リスナー
# ------------------------------------------------------------------------------

resource "aws_lb_listener" "main" {
  load_balancer_arn = aws_lb.main.arn                       # リスナーが適用されるロードバランサー
  protocol          = "HTTPS"                               # 通信に使用するプロトコル
  port              = 443                                   # リッスンするポート番号
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06" # TLS 1.3 に対応した 2021/06 バージョンのポリシー
  certificate_arn   = var.acm_arn                           # ACM で管理された SSL 証明書
  depends_on        = [var.acm_arn]
  tags              = { Name = "${var.prefix}-alb-listener" }

  # 開発環境等で HTTP を使用する場合は下記
  # protocol          = "HTTP"
  # port              = 80

  # デフォルトアクション (後続のリスナールールにマッチしなかった場合)
  default_action {
    type = "fixed-response"       # リクエストに対して固定のレスポンスを返却
    fixed_response {              # レスポンスの内容
      content_type = "text/plain" # コンテンツタイプ
      status_code  = "404"        # HTTP ステータスコード
    }
  }
}

resource "aws_lb_listener_rule" "app" {
  listener_arn = aws_lb_listener.main.arn # ルールを適用するリスナー
  priority     = 1                        # ルールの優先順位 (数値が小さいほど優先度が高い)
  tags         = { Name = "${var.prefix}-alb-app-listener-rule" }


  # ルールが適用される条件
  condition {
    path_pattern { # リクエストのパスが指定のパターンに一致する場合
      values = ["/*"]
    }
  }

  # 条件に一致した場合の処理
  action {
    type             = "forward"                   # リクエストを指定のターゲットグループに転送
    target_group_arn = aws_lb_target_group.app.arn # 転送先のターゲットグループ
  }
}

# ------------------------------------------------------------------------------
# ターゲットグループ
# ------------------------------------------------------------------------------

resource "aws_lb_target_group" "app" {
  vpc_id      = var.vpc_main_id # 配置される VPC
  protocol    = "HTTP"          # 通信に使用するプロトコル
  port        = var.app_port    # リッスンするポート番号
  target_type = "ip"            # ターゲットのリソースタイプ (IP アドレスを指定する) {ip|instance|lambda} ※ip の場合は ECS タスクのネットワークモードが awsvpc であること
  name        = "${var.prefix}-alb-app-tg"
  tags        = { Name = "${var.prefix}-alb-app-tg" }

  # ヘルスチェックの設定
  health_check {
    enabled             = true           # ヘルスチェックの有効化
    port                = "traffic-port" # ターゲットグループで指定したポート番号をヘルスチェックでも使用
    protocol            = "HTTP"         # ヘルスチェックに使用する通信プロトコル
    matcher             = "200"          # 正常応答として扱われる HTTP ステータスコード
    interval            = 30             # リクエストの間隔
    timeout             = 5              # タイムアウト時間
    healthy_threshold   = 3              # ヘルスチェックを成功と判定するまでに必要な正常応答の連続回数
    unhealthy_threshold = 3              # ヘルスチェックを失敗と判定するまでに必要な異常応答の連続回数

    # 末尾がスラッシュだとリダイレクト[3XX]するので付けないように
    path = "/api/health"
  }
}
