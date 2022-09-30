# ------------------------------------------------------------------------------
# EC2 電源管理スケジュール処理
# ------------------------------------------------------------------------------

# EC2 停止スケジュール
resource "aws_scheduler_schedule" "ec2_bastion_stop" {
  name                         = "${var.prefix}-schedule-ec2-bastion-stop"
  group_name                   = aws_scheduler_schedule_group.power_save.name
  state                        = "ENABLED"
  schedule_expression          = "cron(0 3 * * ? *)" # 毎日 03:00
  schedule_expression_timezone = "Asia/Tokyo"        # JST

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:ec2:stopInstances"
    role_arn = aws_iam_role.ec2_bastion_scheduler_role.arn
    input = jsonencode({
      "InstanceIds" : [aws_instance.bastion.id]
    })
    retry_policy {
      maximum_retry_attempts = 0 # 再試行ポリシーを無効化
    }
  }
}

# ------------------------------------------------------------------------------
# EC2 電源管理用 IAM
# ------------------------------------------------------------------------------

# スケジュール処理用ロール
resource "aws_iam_role" "ec2_bastion_scheduler_role" {
  name = "${var.prefix}-ec2-bastion-scheduler-role"

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

# EC2 電源管理ポリシー
resource "aws_iam_role_policy" "ec2_bastion_power_policy" {
  name = "${var.prefix}-ec2-bastion-power-policy"
  role = aws_iam_role.ec2_bastion_scheduler_role.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "ec2:StopInstances"
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:ec2:${var.region}:${var.account_id}:instance/${aws_instance.bastion.id}",
      }
    ],
  })
}
