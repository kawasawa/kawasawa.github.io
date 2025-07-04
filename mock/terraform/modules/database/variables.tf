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

variable "vpc_main_id" {
  type        = string
  description = "VPC の ID"
}

variable "subnet_public_a_id" {
  type        = string
  description = "パブリックサブネット A の ID (踏み台サーバ用)"
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
  description = "プライベートサブネット C の CIDR ブロック"
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

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}
