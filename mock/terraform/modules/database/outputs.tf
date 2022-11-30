# ******************************************************************************
# 戻り値
# ******************************************************************************

output "db_instance_main_identifier" {
  value       = aws_db_instance.main.identifier
  description = "データベースインスタンスの識別子"
}
output "db_instance_main_address" {
  value       = aws_db_instance.main.address
  description = "データベースインスタンスのエンドポイントアドレス"
}
