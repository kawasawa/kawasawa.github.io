# ******************************************************************************
# 引数
# ******************************************************************************

variable "prefix" {
  type        = string
  description = "リソース名に付与するプレフィックス"
}

variable "environment" {
  type        = string
  description = "環境識別子 {dev|stg|prd}"
}

variable "alert_webhook_url" {
  type        = string
  description = "アラート通知の Webhook URL"
}

variable "alb_arn_suffix" {
  type        = string
  description = "ALB の ARN サフィックス"
}

variable "alb_target_group_app_arn_suffix" {
  type        = string
  description = "ALB のターゲットグループの ARN サフィックス"
}

variable "cloudwatch_log_group_app_name" {
  type        = string
  description = "ECS タスクのログを保存する CloudWatch Logs グループの名前"
}

variable "cloudwatch_log_group_app_arn" {
  type        = string
  description = "ECS タスクのログを保存する CloudWatch Logs グループの ARN"
}

# ******************************************************************************
# 変数
# ******************************************************************************

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}
