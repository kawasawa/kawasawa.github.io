# ******************************************************************************
# 戻り値
# ******************************************************************************

output "security_group_ecs_id" {
  value       = aws_security_group.ecs.id
  description = "ECS 用セキュリティグループの ID"
}
