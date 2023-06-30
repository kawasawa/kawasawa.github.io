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

variable "subnet_private_a_cidr_block" {
  type        = string
  description = "プライベートサブネット A の CIDR ブロック"
}

variable "subnet_private_c_cidr_block" {
  type        = string
  description = "プライベートサブネット C の CIDR ブロック"
}

variable "db_port" {
  type        = number
  description = "データベースのポート番号"
}

# ******************************************************************************
# 変数
# ******************************************************************************

locals {
  # terraform apply の実行ディレクトリ配下に生成される
  private_key = "./.ssh/${var.prefix}-bastion-key"
  public_key  = "./.ssh/${var.prefix}-bastion-key.pub"
}
