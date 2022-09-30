# ******************************************************************************
# 引数
# ******************************************************************************

variable "prefix" {
  type        = string
  description = "リソース名に付与するプレフィックス"
}

variable "region" {
  type        = string
  description = "AWS のリージョン"
}

variable "account_id" {
  type        = string
  description = "AWS アカウント ID"
}

variable "environment" {
  type        = string
  description = "環境識別子 {dev|stg|prd}"
}

variable "alert_webhook_url" {
  type        = string
  description = "アラート通知の Webhook URL"
}

variable "alb_arn" {
  type        = string
  description = "ALB の ARN"
}

variable "alb_arn_suffix" {
  type        = string
  description = "ALB の ARN サフィックス"
}

variable "alb_target_group_app_arn_suffix" {
  type        = string
  description = "ALB のターゲットグループの ARN サフィックス"
}

variable "ecs_cluster_main_name" {
  type        = string
  description = "ECS クラスターの名前"
}

variable "ecs_service_app_name" {
  type        = string
  description = "ECS サービスの名前"
}

variable "db_instance_main_identifier" {
  type        = string
  description = "データベースインスタンスの識別子"
}

variable "cloudwatch_log_group_app_name" {
  type        = string
  description = "ECS タスクのログを保存する CloudWatch Logs グループの名前"
}

variable "cloudwatch_log_group_app_arn" {
  type        = string
  description = "ECS タスクのログを保存する CloudWatch Logs グループの ARN"
}
