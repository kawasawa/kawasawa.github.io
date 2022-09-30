# ******************************************************************************
# 環境変数
# ******************************************************************************

# LocalStack で動作させる場合は "local" を指定する (一部の AWS リソースをモックするため)
variable "environment" {
  default     = "local"
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
