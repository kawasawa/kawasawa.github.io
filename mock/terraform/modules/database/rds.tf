# NOTE: DB のフェイルオーバー、レプリカ、バックアップの違い
# - フェイルオーバー
#     目的: 可用性向上
#     同期: 双方向
#     概要: プライマリーの障害時、自動的にセカンダリー (スタンバイ) に切り替えることでサービスの継続を図る
#           AWS では異なる AZ に 配置するため、multi_az を有効化することでフェイルオーバーが行われる
# - レプリカ
#     目的: 負荷分散
#     同期: 単方向
#     概要: レプリカは読み取り専用で、大量アクセス時にレプリカを SELECT 用 DB として利用することで負荷分散が可能
# - バックアップ
#     目的: データ保護
#     同期: 単方向
#     概要: RDS では一定間隔で DB のバックアップ (スナップショット) を取得し、指定の日数 S3 に保管する

resource "aws_db_instance" "main" {
  # 基本設定
  identifier     = "${var.prefix}-rds-main"
  instance_class = "db.t3.micro" # db.t3.micro が無料利用枠の対象
  tags           = { Name = "${var.prefix}-rds-main" }

  # ストレージ設定
  storage_type          = "gp3" # 現時点では gp3 ボリュームが最新
  allocated_storage     = 20    # ストレージの初期サイズ (GiB)
  max_allocated_storage = 100   # ストレージの自動拡張上限サイズ (GiB)
  storage_encrypted     = true  # ストレージを暗号化

  # 保護設定
  maintenance_window       = "Sun:12:00-Sun:12:30" # DB エンジンメンテナンス期間 (UTC)
  backup_window            = "11:00-11:30"         # 日時バックアップ実行期間 (UTC)
  backup_retention_period  = 7                     # バックアップの保持日数
  copy_tags_to_snapshot    = true                  # タグ情報をスナップショットに保持
  skip_final_snapshot      = !local.is_production  # [本番:false] インスタンス削除時のスナップショット作成を無効化
  delete_automated_backups = !local.is_production  # [本番:false] インスタンス削除時にバックアップを削除しない
  deletion_protection      = local.is_production   # [本番:true]  Terraform destroy による削除を無効化

  # ネットワーク設定
  multi_az               = true                         # フェイルオーバーを有効化
  db_subnet_group_name   = aws_db_subnet_group.rds.name # プライマリとスタンバイ (フェイルオーバー) は自動的に異なる AZ に配置される
  vpc_security_group_ids = [aws_security_group.rds.id]

  # ログ設定
  enabled_cloudwatch_logs_exports = [
    "error",
    "general",
    "slowquery",
  ]

  # DB 設定
  engine                      = "mysql" # MySQL を指定
  engine_version              = "8.4.3" # LTS 版を指定
  allow_major_version_upgrade = false   # メジャーバージョンアップグレードを無効化
  auto_minor_version_upgrade  = true    # マイナーバージョンアップグレードを自動実施
  db_name                     = var.db_name
  port                        = var.db_port
  password                    = var.db_password
  username                    = var.db_username
}

resource "aws_db_instance" "replica" {
  identifier     = "${var.prefix}-rds-replica"
  instance_class = "db.t3.micro"
  tags           = { Name = "${var.prefix}-rds-replica" }

  max_allocated_storage = 100  # 未定義のままだと変更箇所として検知される項目のみ設定 (基本はプライマリーと同じ設定とする)
  storage_encrypted     = true # ↑

  backup_retention_period = 0    # レプリカはバックアップを無効化
  skip_final_snapshot     = true # レプリカはスナップショットを無効化

  multi_az               = false                       # レプリカはフェイルオーバーを無効化
  vpc_security_group_ids = [aws_security_group.rds.id] # サブネットグループ内でランダムに配置される

  replicate_source_db = aws_db_instance.main.identifier
}
