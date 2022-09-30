resource "aws_security_group" "ecs" {
  vpc_id = var.vpc_main_id
  name   = "${var.prefix}-ecs-sg"
  tags   = { Name = "${var.prefix}-ecs-sg" }

  # ALB からのインバウンドを許可
  ingress {
    protocol  = "tcp"
    from_port = var.app_port
    to_port   = var.app_port
    security_groups = [
      var.security_group_alb_id
    ]
  }

  # RDS へのアウトバウンドを許可
  egress {
    protocol  = "tcp"
    from_port = var.db_port
    to_port   = var.db_port
    cidr_blocks = [
      var.subnet_private_a_cidr_block,
      var.subnet_private_c_cidr_block,
    ]
  }

  # HTTPS でのアウトバウンドを許可
  # (ECR や CloudWatch に向かうルート)
  egress {
    protocol  = "tcp"
    from_port = 443
    to_port   = 443
    # trivy:ignore:AVD-AWS-0104: すべての IP アドレスに対するアウトバウンドを許可
    cidr_blocks = ["0.0.0.0/0"]
  }
}
