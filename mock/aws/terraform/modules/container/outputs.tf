# ******************************************************************************
# 戻り値
# ******************************************************************************

output "ecs_cluster_main_name" {
  value       = aws_ecs_cluster.main.name
  description = "ECS クラスターの名前"
}
output "ecs_service_app_name" {
  value       = aws_ecs_service.app.name
  description = "ECS サービスの名前"
}

output "security_group_ecs_id" {
  value       = aws_security_group.ecs.id
  description = "ECS 用セキュリティグループの ID"
}

output "cloudwatch_log_group_app_name" {
  value       = aws_cloudwatch_log_group.app.name
  description = "ECS タスクのログを保存する CloudWatch Logs グループの名前"
}
output "cloudwatch_log_group_app_arn" {
  value       = aws_cloudwatch_log_group.app.arn
  description = "ECS タスクのログを保存する CloudWatch Logs グループの ARN"
}
