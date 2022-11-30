# ******************************************************************************
# 戻り値
# ******************************************************************************

output "security_group_alb_id" {
  value       = aws_security_group.alb.id
  description = "ALB 用セキュリティグループの ID"
}

output "alb_target_group_app_arn" {
  value       = aws_lb_target_group.app.arn
  description = "ALB のターゲットグループの ARN"
}
