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
  description = "パブリックサブネット A の ID"
}

variable "subnet_public_c_id" {
  type        = string
  description = "パブリックサブネット C の ID"
}

variable "subnet_private_a_cidr_block" {
  type        = string
  description = "プライベートサブネット A の CIDR ブロック"
}

variable "subnet_private_c_cidr_block" {
  type        = string
  description = "プライベートサブネット C の CIDR ブロック"
}

variable "app_port" {
  type        = number
  description = "アプリケーションのポート番号"
}

variable "domain" {
  type        = string
  description = "プロジェクトが使用するドメイン名"
}

variable "dns_zone_id" {
  type        = string
  description = "ドメインの Route 53 ホストゾーン ID"
}

variable "acm_arn" {
  type        = string
  description = "SSL証明書を発行した ACM の ARN"
}

# ******************************************************************************
# 変数
# ******************************************************************************

locals {
  dns_record_name = var.environment == "prd" ? var.domain : "${var.environment}.${var.domain}"
}
