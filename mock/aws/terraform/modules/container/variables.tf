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

variable "vpc_main_id" {
  type        = string
  description = "VPC の ID"
}

variable "subnet_private_a_id" {
  type        = string
  description = "プライベートサブネット A の ID"
}

variable "subnet_private_c_id" {
  type        = string
  description = "プライベートサブネット C の ID"
}

variable "subnet_private_a_cidr_block" {
  type        = string
  description = "プライベートサブネット A の CIDR ブロック"
}

variable "subnet_private_c_cidr_block" {
  type        = string
  description = "プライベートサブネット（AZ-C）のCIDRブロック"
}

variable "alb_target_group_app_arn" {
  type        = string
  description = "ALB のターゲットグループ ARN"
}

variable "security_group_alb_id" {
  type        = string
  description = "ALB 用セキュリティグループの ID"
}

variable "min_container_count" {
  type        = number
  description = "コンテナの最小実行数"
}

variable "max_container_count" {
  type        = number
  description = "コンテナの最大実行数"
}

variable "app_port" {
  type        = number
  description = "アプリケーションのポート番号"
}

variable "db_port" {
  type        = number
  description = "データベースのポート番号"
}

variable "db_name" {
  type        = string
  description = "データベースの名称"
}

variable "db_username" {
  type        = string
  description = "データベースのユーザー名"
}

variable "db_password" {
  type        = string
  description = "データベースのパスワード"
  sensitive   = true
}

variable "db_address" {
  type        = string
  description = "データベースのエンドポイントアドレス"
}

variable "schedule_group_power_save_name" {
  type        = string
  description = "電源管理用スケジュールグループの名前"
}

# ******************************************************************************
# 変数
# ******************************************************************************

variable "container_app_name" {
  default     = "express"
  type        = string
  description = "コンテナイメージの名称"
}
variable "container_app_tag" {
  default     = "latest"
  type        = string
  description = "コンテナイメージのタグ"
}

locals {
  is_production = var.environment == "prd"
}
