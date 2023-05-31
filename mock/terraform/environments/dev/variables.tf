# ******************************************************************************
# 共通変数
# ******************************************************************************

variable "project_short_name" {
  default     = "kawasawa"
  type        = string
  description = "プロジェクトの短縮名"
}

variable "project_name" {
  default     = "kawasawa.github.io"
  type        = string
  description = "プロジェクトの名称"
}

variable "project_owner" {
  default     = "Kazuki Awasawa"
  type        = string
  description = "プロジェクトの所有者"
}

# ******************************************************************************
# 環境変数
# ******************************************************************************

variable "region" {
  default     = "ap-northeast-1"
  type        = string
  description = "AWSのリージョン"
}

variable "environment" {
  default     = "dev"
  type        = string
  description = "デプロイ先の環境 [dev/stg/prd]"
}

# ******************************************************************************
# 固有変数
# ******************************************************************************

variable "db_name" {
  default     = "kawasawa"
  type        = string
  description = "データベースの名称"
}

variable "db_port" {
  default     = 3306
  type        = number
  description = "データベースのポート番号"
}

variable "app_port" {
  default     = 3000
  type        = number
  description = "アプリケーションのポート番号"
}

# ******************************************************************************
# 固有変数 (シークレット)
# ******************************************************************************

variable "db_username" {
  type        = string
  description = "データベースのユーザ名 (SECRET)"
}

variable "db_password" {
  type        = string
  description = "データベースのパスワード (SECRET)"
  sensitive   = true
}
