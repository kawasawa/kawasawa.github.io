# ******************************************************************************
# 引数
# ******************************************************************************

variable "prefix" {
  type        = string
  description = "リソース名に付与するプレフィックス"
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
