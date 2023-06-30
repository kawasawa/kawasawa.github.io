resource "aws_security_group" "rds" {
  vpc_id = var.vpc_main_id
  name   = "${var.prefix}-rds-sg"
  tags   = { Name = "${var.prefix}-rds-sg" }

  # ECS と踏み台サーバからのインバウンドを許可
  ingress {
    protocol  = "tcp"
    from_port = var.db_port          # DB サーバのポート番号
    to_port   = var.db_port          # DB サーバのポート番号
    security_groups = [              # 指定のセキュリティグループからの通信を許可する
      var.security_group_ecs_id,     # ECS
      var.security_group_bastion_id, # 踏み台サーバ
    ]
  }

  # すべてのアウトバウンドを許可
  egress {
    protocol    = "-1"          # すべてのプロトコルを許可
    from_port   = 0             # すべてのポート番号を許可
    to_port     = 0             # すべてのポート番号を許可
    cidr_blocks = ["0.0.0.0/0"] # すべての IP アドレスを許可
  }
}
