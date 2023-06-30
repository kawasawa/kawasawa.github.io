# ******************************************************************************
# 引数
# ******************************************************************************
variable "prefix" {
  type        = string
  description = "リソース名に付与するプレフィックス"
}

variable "environment" {
  type        = string
  description = "環境識別子 [dev/stg/prd]"
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

variable "security_group_bastion_id" {
  type        = string
  description = "踏み台サーバ用セキュリティグループの ID"
}

variable "security_group_ecs_id" {
  type        = string
  description = "ECS 用セキュリティグループの ID"
}

variable "db_name" {
  type        = string
  description = "データベースの名称"
}

variable "db_port" {
  type        = number
  description = "データベースのポート番号"
}

variable "db_username" {
  type        = string
  description = "データベースのユーザ名"
}

variable "db_password" {
  type        = string
  description = "データベースのパスワード"
  sensitive   = true
}

# ******************************************************************************
# 変数
# ******************************************************************************

locals {
  is_production = var.environment == "prd"
}
