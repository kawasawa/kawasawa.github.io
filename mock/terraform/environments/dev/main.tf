locals {
  prefix = "${var.project_short_name}-${var.environment}"
}

module "network" {
  source = "../../modules/network"
  prefix = local.prefix
}

module "load_balancer" {
  source                      = "../../modules/load_balancer"
  prefix                      = local.prefix
  environment                 = var.environment
  vpc_main_id                 = module.network.vpc_main_id
  subnet_public_a_id          = module.network.subnet_public_a_id
  subnet_public_c_id          = module.network.subnet_public_c_id
  subnet_private_a_cidr_block = module.network.subnet_private_a_cidr_block
  subnet_private_c_cidr_block = module.network.subnet_private_c_cidr_block
  app_port                    = var.app_port
  domain                      = var.domain
  acm_arn                     = var.acm_arn
  dns_zone_id                 = var.dns_zone_id
}

module "database" {
  source                      = "../../modules/database"
  prefix                      = local.prefix
  environment                 = var.environment
  vpc_main_id                 = module.network.vpc_main_id
  subnet_public_a_id          = module.network.subnet_public_a_id
  subnet_private_a_id         = module.network.subnet_private_a_id
  subnet_private_c_id         = module.network.subnet_private_c_id
  subnet_private_a_cidr_block = module.network.subnet_private_a_cidr_block
  subnet_private_c_cidr_block = module.network.subnet_private_c_cidr_block
  security_group_ecs_id       = module.container.security_group_ecs_id
  db_port                     = var.db_port
  db_name                     = var.db_name
  db_username                 = var.db_username
  db_password                 = var.db_password
}

module "container" {
  source                      = "../../modules/container"
  prefix                      = local.prefix
  vpc_main_id                 = module.network.vpc_main_id
  subnet_private_a_id         = module.network.subnet_private_a_id
  subnet_private_c_id         = module.network.subnet_private_c_id
  subnet_private_a_cidr_block = module.network.subnet_private_a_cidr_block
  subnet_private_c_cidr_block = module.network.subnet_private_c_cidr_block
  security_group_alb_id       = module.load_balancer.security_group_alb_id
  alb_target_group_app_arn    = module.load_balancer.alb_target_group_app_arn
  min_container_count         = var.min_container_count
  max_container_count         = var.max_container_count
  app_port                    = var.app_port
  db_port                     = var.db_port
  db_name                     = var.db_name
  db_username                 = var.db_username
  db_password                 = var.db_password
  db_address                  = module.database.db_instance_main_address
}

module "monitor" {
  source                          = "../../modules/monitor"
  prefix                          = local.prefix
  environment                     = var.environment
  alert_webhook_url               = var.alert_webhook_url
  alb_arn_suffix                  = module.load_balancer.alb_arn_suffix
  alb_target_group_app_arn_suffix = module.load_balancer.alb_target_group_app_arn_suffix
  cloudwatch_log_group_app_name   = module.container.cloudwatch_log_group_app_name
  cloudwatch_log_group_app_arn    = module.container.cloudwatch_log_group_app_arn
}
