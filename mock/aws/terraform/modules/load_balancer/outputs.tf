# ******************************************************************************
# 戻り値
# ******************************************************************************

output "security_group_alb_id" {
  value       = aws_security_group.alb.id
  description = "ALB 用セキュリティグループの ID"
}

output "alb_arn" {
  value       = aws_lb.main.arn
  description = "ALB の ARN"
}
output "alb_arn_suffix" {
  value       = aws_lb.main.arn_suffix
  description = "ALB の ARN サフィックス"
}

output "alb_target_group_app_arn" {
  value       = aws_lb_target_group.app.arn
  description = "ALB のターゲットグループの ARN"
}
output "alb_target_group_app_arn_suffix" {
  value       = aws_lb_target_group.app.arn_suffix
  description = "ALB のターゲットグループの ARN サフィックス"
}
