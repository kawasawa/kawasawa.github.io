resource "aws_cloudwatch_dashboard" "cloudwatch_default" {
  dashboard_name = var.environment == "prd" ? "CloudWatch-Default" : "CloudWatch-Default-${var.environment}"

  dashboard_body = templatefile("${path.module}/templates/cloudwatch-default.tpl", {
    region                          = var.region,
    alb_arn                         = var.alb_arn,
    alb_arn_suffix                  = var.alb_arn_suffix,
    alb_target_group_app_arn_suffix = var.alb_target_group_app_arn_suffix,
    cloudwatch_log_group_app_name   = var.cloudwatch_log_group_app_name,
    ecs_cluster_main_name           = var.ecs_cluster_main_name,
    ecs_service_app_name            = var.ecs_service_app_name,
    db_instance_main_identifier     = var.db_instance_main_identifier,
  })
}
