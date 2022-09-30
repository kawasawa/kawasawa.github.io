# ******************************************************************************
# 環境変数
# ******************************************************************************

# NOTE: AWS の環境名は文字数を揃えると良い
# 一般的には dev, stage, prod がよく使われるが、個人的には dev, stg, prd を採用したい
# AWS に限らず IaaS 系のリソースは命名時の文字数制限が短い傾向がある
# リソース名に環境名を含める場合、 "dev" では問題ないが "prod" は制限に達するケースがある
variable "environment" {
  default     = "dev"
  type        = string
  description = "デプロイ先の環境 {dev|stg|prd}"
}

variable "min_container_count" {
  default     = 1
  type        = number
  description = "コンテナの最小実行数"
}

variable "max_container_count" {
  default     = 3
  type        = number
  description = "コンテナの最大実行数"
}

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

variable "domain" {
  default     = "kawasawa.com"
  type        = string
  description = "プロジェクトが使用するドメイン名"
}

variable "dns_zone_id" {
  default     = "Z1234567890ABCDEFGHIJ"
  type        = string
  description = "ドメインの Route 53 ホストゾーン ID"
}

variable "acm_arn_suffix" {
  default     = "12345678-90ab-cdef-1234-567890abcdef"
  type        = string
  description = "SSL 証明書を発行した ACM の ARN のサフィックス"
}

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

variable "alert_webhook_url" {
  type        = string
  description = "アラート通知の宛先となる Webhook URL"
}
