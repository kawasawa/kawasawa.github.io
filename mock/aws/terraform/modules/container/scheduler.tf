# ECS はスケジュールスケーリング (aws_appautoscaling_scheduled_action) でも時間帯に応じたタスク数の増減ができる
# ただし、本プロダクトでは RDS や EC2 の電源管理も行っており、それらと足並みを揃えるために ECS の電源管理も aws_scheduler_schedule で実装する


# ------------------------------------------------------------------------------
# ECS 電源管理スケジュール処理
# ------------------------------------------------------------------------------

# ECS サービス起動スケジュール
resource "aws_scheduler_schedule" "ecs_start" {
  count = !local.is_production ? 1 : 0 # 開発環境のみでリソース作成

  name                         = "${var.prefix}-schedule-ecs-start"
  group_name                   = var.schedule_group_power_save_name
  state                        = "ENABLED"
  schedule_expression          = "cron(0 8 ? * MON-FRI *)" # 月-金 08:00
  schedule_expression_timezone = "Asia/Tokyo"              # JST

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:ecs:updateService"
    role_arn = aws_iam_role.ecs_scheduler_role[0].arn
    input = jsonencode({
      "Cluster" : aws_ecs_cluster.main.name,
      "Service" : aws_ecs_service.app.name,
      "DesiredCount" : var.min_container_count
    })
    retry_policy {
      maximum_retry_attempts = 0 # 再試行ポリシーを無効化
    }
  }
}

# ECS サービス停止スケジュール
resource "aws_scheduler_schedule" "ecs_stop" {
  count = !local.is_production ? 1 : 0 # 開発環境のみでリソース作成

  name                         = "${var.prefix}-schedule-ecs-stop"
  group_name                   = var.schedule_group_power_save_name
  state                        = "ENABLED"
  schedule_expression          = "cron(0 19 ? * MON-FRI *)" # 月-金 19:00
  schedule_expression_timezone = "Asia/Tokyo"               # JST

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:ecs:updateService"
    role_arn = aws_iam_role.ecs_scheduler_role[0].arn
    input = jsonencode({
      "Cluster" : aws_ecs_cluster.main.name,
      "Service" : aws_ecs_service.app.name,
      "DesiredCount" : 0
    })
    retry_policy {
      maximum_retry_attempts = 0 # 再試行ポリシーを無効化
    }
  }
}

# ------------------------------------------------------------------------------
# ECS 電源管理用 IAM
# ------------------------------------------------------------------------------

# スケジュール処理用ロール
resource "aws_iam_role" "ecs_scheduler_role" {
  count = !local.is_production ? 1 : 0 # 開発環境のみでリソース作成

  name = "${var.prefix}-ecs-scheduler-role"

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

# ECS 電源管理ポリシー
resource "aws_iam_role_policy" "ecs_power_policy" {
  count = !local.is_production ? 1 : 0 # 開発環境のみでリソース作成

  name = "${var.prefix}-ecs-power-policy"
  role = aws_iam_role.ecs_scheduler_role[0].id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "ecs:UpdateService"
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:ecs:${var.region}:${var.account_id}:service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
      }
    ],
  })
}
