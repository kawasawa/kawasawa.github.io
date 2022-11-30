resource "aws_ecs_cluster" "main" {
  name = "${var.prefix}-ecs-cluster"
  tags = { Name = "${var.prefix}-ecs-cluster" }
}
