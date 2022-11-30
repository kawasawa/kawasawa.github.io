# タスク実行用ロール
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.prefix}-ecs-task-execution-role"
  tags = { Name = "${var.prefix}-ecs-iam" }

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# タスクの実行権限
resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECR へのアクセス権限
resource "aws_iam_role_policy_attachment" "ecs_ecr_read_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}
