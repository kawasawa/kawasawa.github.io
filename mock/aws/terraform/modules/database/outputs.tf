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
output "schedule_group_power_save_name" {
  value       = aws_scheduler_schedule_group.power_save.name
  description = "電源管理用スケジュールグループの名前"
}
