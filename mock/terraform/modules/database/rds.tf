# NOTE: DB のフェイルオーバー、バックアップ、レプリカは目的が異なる
# - フェイルオーバー
#     目的: 可用性向上
#     同期: 双方向
#     概要: プライマリーの障害時、自動的にセカンダリー (スタンバイ) に切り替えることでサービスの継続を図る
#           AWS では異なる AZ に 配置するため、multi_az を有効化することでフェイルオーバーが行われる
# - バックアップ
#     目的: データ保護
#     同期: 単方向
#     概要: RDS では一定間隔で DB のバックアップ (スナップショット) を取得し、指定の日数 S3 に保管する
# - レプリカ
#     目的: 負荷分散
#     同期: 単方向
#     概要: レプリカは読み取り専用で、大量アクセス時にレプリカを SELECT 用 DB として利用することで負荷分散が可能

# ------------------------------------------------------------------------------
# RDS インスタンス (プライマリ)
# ------------------------------------------------------------------------------

# NOTE: RDS のデータ保護は 2 段階で行われる
# 1. フェイルオーバー
#    multi_az を有効化することでフェイルオーバーが可能になる
#    プライマリとセカンダリが異なる AZ に配置され、プライマリの障害発生時に自動でセカンダリに切り替わる
#    データ損失は無くエンドポイントも変わらないが、切り替わりの際に数分のダウンタイムが発生する
#      https://lab.taf-jp.com/rdsのフェイルオーバー時の挙動を理解してみる/
# 2. フルバックアップ復旧 (リストア) + トランザクションログ再実行 (リカバリ)
#    backup_window の設定により日次でフルバックアップを実行され、加えて 5 分置きにトランザクションログ (増分バックアップ) も退避される
#    復元の際はまずバックアップファイルを DB に戻し (リストア)、これに対してトランザクションログを再実行 (リカバリ) していく
#    退避前のトランザクションログの適用 (ロールフォワード) はできないため AWS の退避間隔である 5 分以内のデータ損失は避けられない
#    ※ 一方 Aurora は、ロールフォワードではないものの、データ更新のたびにバックアップを行うためほぼ損失無くデータ復旧が可能
#    RDS の復元時には新しい DB を作成されるため、そのレコードを既存 DB に移植するか、アプリ側の DB の向き先を変更する必要がある
#      https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PIT.html

resource "aws_db_instance" "main" {
  # 基本設定
  identifier     = "${var.prefix}-rds-main"
  instance_class = "db.t3.micro" # ※ 無料利用枠: db.t3.micro
  tags           = { Name = "${var.prefix}-rds-main" }

  # ストレージ設定
  storage_type          = "gp3" # 現時点では gp3 ボリュームが最新
  allocated_storage     = 20    # ストレージの初期サイズ (GiB)
  max_allocated_storage = 100   # ストレージの自動拡張上限サイズ (GiB)
  storage_encrypted     = true  # ストレージを暗号化 (AVD-AWS-0080 対応)

  # メンテナンス設定
  # NOTE: 商用環境の RDS では、DB のバックアップを取得、保持する (ただし、ストレージの占有量によっては利用料が増える)
  maintenance_window      = "Sat:18:30-Sat:19:30"       # DB エンジンメンテナンス期間 (JST: 日曜 03:30-04:30)
  backup_window           = "17:00-18:00"               # 日時バックアップ実行期間 (JST: 02:00-03:00) ※ maintenance_window と重複しないように設定
  copy_tags_to_snapshot   = true                        # タグ情報をスナップショットに保持
  skip_final_snapshot     = true                        # インスタンス削除時のスナップショット作成をスキップ
  backup_retention_period = local.is_production ? 7 : 0 # [prd:7日, dev:無効] バックアップの保持日数

  # 保護設定
  # NOTE: 商用環境の RDS では、DB インスタンスの削除を禁止する
  #   削除する場合は手動で「削除保護」を無効化した上で、「保持」された「自動バックアップ」も除去する必要がある
  delete_automated_backups = !local.is_production # [prd:false] インスタンス削除時にバックアップを削除しない
  deletion_protection      = local.is_production  # [prd:true]  削除保護を有効化

  # ネットワーク設定
  # NOTE: 商用環境の RDS では、DB インスタンスをマルチ AZ 配置にして可用性を向上させる (ただし冗長化に伴い利用料は増える)
  multi_az               = local.is_production          # [prd:true] フェイルオーバーを有効化
  db_subnet_group_name   = aws_db_subnet_group.rds.name # プライマリとスタンバイ (フェイルオーバー) は自動的に異なる AZ に配置される
  vpc_security_group_ids = [aws_security_group.rds.id]

  # モニタリング設定
  monitoring_role_arn = aws_iam_role.rds_monitoring_role.arn
  monitoring_interval = 60

  # パラメータ設定
  parameter_group_name = aws_db_parameter_group.mysql.name
  option_group_name    = aws_db_option_group.mysql.name
  enabled_cloudwatch_logs_exports = [
    "audit",
    "error",
    "general",
    "slowquery",
  ]

  # DB 設定
  engine                      = "mysql" # MySQL を指定
  engine_version              = "8.4.3" # LTS 版を指定
  allow_major_version_upgrade = false   # メジャーバージョンアップグレードを無効化
  auto_minor_version_upgrade  = false   # マイナーバージョンアップグレードを無効化
  db_name                     = var.db_name
  port                        = var.db_port
  password                    = var.db_password
  username                    = var.db_username
}

# ログの保持期間を変更
resource "terraform_data" "main" {
  triggers_replace = [
    aws_db_instance.main.identifier
  ]

  provisioner "local-exec" {
    command = <<-EOT
      aws logs put-retention-policy \
        --log-group-name "/aws/rds/instance/${aws_db_instance.main.identifier}/audit" \
        --retention-in-days 7
    EOT
  }

  provisioner "local-exec" {
    command = <<-EOT
      aws logs put-retention-policy \
        --log-group-name "/aws/rds/instance/${aws_db_instance.main.identifier}/general" \
        --retention-in-days 7
    EOT
  }
}

# ------------------------------------------------------------------------------
# RDS パラメータグループ
# ------------------------------------------------------------------------------

resource "aws_db_parameter_group" "mysql" {
  name   = "${var.prefix}-rds-parameter-group"
  family = "mysql8.4"

  # 文字コード設定
  parameter {
    name  = "character_set_server"
    value = "utf8mb4"
  }
  parameter {
    name  = "collation_server"
    value = "utf8mb4_bin"
  }

  # ログ設定
  parameter {
    name  = "log_error_verbosity"
    value = "2"
  }
  parameter {
    name  = "general_log"
    value = "1"
  }
  parameter {
    name  = "slow_query_log"
    value = "1"
  }
  parameter {
    name  = "long_query_time"
    value = "3.0"
  }
  parameter {
    name  = "log_queries_not_using_indexes"
    value = "0" # rdsadmin の定期実行が出力されるため無効化
  }

  # CloudWatch にログを発行
  #   see: https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_LogAccess.MySQLDB.PublishtoCloudWatchLogs.html
  parameter {
    name  = "log_output"
    value = "FILE"
  }

  # `Name or service not known` のエラーを抑制
  #   see: https://repost.aws/ja/knowledge-center/rds-mysql-name-not-known
  parameter {
    name         = "skip_name_resolve"
    value        = "1"
    apply_method = "pending-reboot"
  }
}

# ------------------------------------------------------------------------------
# オプショングループ
# ------------------------------------------------------------------------------

resource "aws_db_option_group" "mysql" {
  name                 = "${var.prefix}-rds-option-group"
  engine_name          = "mysql"
  major_engine_version = "8.4"

  # 監査プラグイン
  #   see: https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Appendix.MySQL.Options.AuditPlugin.html
  option {
    option_name = "MARIADB_AUDIT_PLUGIN"

    # rdsadmin は AWS が作成するユーザで定期的に RDS のステータス確認を行っている
    # これに伴い、rdsadmin による操作ログが大量に出力されるため、監査対象からは除外する
    #   see: https://dev.classmethod.jp/articles/who-is-rdsadmin-and-how-to-exclude-activity-logs-related-to-rdsadmin/
    option_settings {
      name  = "SERVER_AUDIT_EXCL_USERS"
      value = "rdsadmin"
    }
  }
}

# ------------------------------------------------------------------------------
# RDS インスタンス (レプリカ)
# ------------------------------------------------------------------------------

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
