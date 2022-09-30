# ------------------------------------------------------------------------------
# RDS 電源管理スケジュール処理
# ------------------------------------------------------------------------------

# RDS 起動スケジュール
resource "aws_scheduler_schedule" "rds_start" {
  count = !local.is_production ? 1 : 0 # 開発環境のみでリソース作成

  name                         = "${var.prefix}-schedule-rds-start"
  group_name                   = aws_scheduler_schedule_group.power_save.name
  state                        = "ENABLED"
  schedule_expression          = "cron(0 8 ? * MON-FRI *)" # 月-金 08:00
  schedule_expression_timezone = "Asia/Tokyo"              # JST

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:rds:startDBInstance"
    role_arn = aws_iam_role.rds_scheduler_role[0].arn
    input = jsonencode({
      "DbInstanceIdentifier" : aws_db_instance.main.identifier
    })
    retry_policy {
      maximum_retry_attempts = 0 # 再試行ポリシーを無効化
    }
  }
}

# RDS 停止スケジュール
resource "aws_scheduler_schedule" "rds_stop" {
  count = !local.is_production ? 1 : 0 # 開発環境のみでリソース作成

  name                         = "${var.prefix}-schedule-rds-stop"
  group_name                   = aws_scheduler_schedule_group.power_save.name
  state                        = "ENABLED"
  schedule_expression          = "cron(0 19 ? * MON-FRI *)" # 月-金 19:00
  schedule_expression_timezone = "Asia/Tokyo"               # JST

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:rds:stopDBInstance"
    role_arn = aws_iam_role.rds_scheduler_role[0].arn
    input = jsonencode({
      "DbInstanceIdentifier" : aws_db_instance.main.identifier
    })
    retry_policy {
      maximum_retry_attempts = 0 # 再試行ポリシーを無効化
    }
  }
}

# ------------------------------------------------------------------------------
# RDS 電源管理用 IAM
# ------------------------------------------------------------------------------

# スケジュール処理用ロール
resource "aws_iam_role" "rds_scheduler_role" {
  count = !local.is_production ? 1 : 0 # 開発環境のみでリソース作成

  name = "${var.prefix}-rds-scheduler-role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "scheduler.amazonaws.com",
        },
      },
    ],
  })
}

# RDS 電源管理ポリシー
resource "aws_iam_role_policy" "rds_power_policy" {
  count = !local.is_production ? 1 : 0 # 開発環境のみでリソース作成

  name = "${var.prefix}-rds-power-policy"
  role = aws_iam_role.rds_scheduler_role[0].id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "rds:StartDBInstance",
          "rds:StopDBInstance"
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:rds:${var.region}:${var.account_id}:db:${aws_db_instance.main.identifier}",
      }
    ],
  })
}
