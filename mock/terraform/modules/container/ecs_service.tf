# ------------------------------------------------------------------------------
# ECS サービス
# ------------------------------------------------------------------------------

resource "aws_ecs_service" "app" {
  cluster          = aws_ecs_cluster.main.name          # サービスが配置されるクラスター
  task_definition  = aws_ecs_task_definition.app.family # サービスが実行するタスク
  launch_type      = "FARGATE"                          # タスクの起動に使用するランタイム環境 {EC2|FARGATE|EXTERNAL} EXTERNAL はオンプレ環境等の AWS マネージド外を指す
  platform_version = "1.4.0"                            # Fargate のバージョン
  desired_count    = var.min_container_count            # タスクの初期起動数
  name             = "${var.prefix}-ecs-app-service"
  tags             = { Name = "${var.prefix}-ecs-app-service" }

  # ネットワークの設定
  network_configuration {
    subnets = [ # マルチ AZ にタスクを分散配置
      var.subnet_private_a_id,
      var.subnet_private_c_id,
    ]
    security_groups = [
      aws_security_group.ecs.id,
    ]
  }

  # ロードバランサーの設定
  load_balancer {
    target_group_arn = var.alb_target_group_app_arn # ECS タスクを ALB のターゲットグループと連携させ、ALB 経由でアクセスを受信できるようにする
    container_name   = var.container_app_name       # ALB が把握するコンテナ名 (task_definition と一致するように指定)
    container_port   = var.app_port                 # ALB が把握するポート番号 (task_definition と一致するように指定)
  }
}

# ------------------------------------------------------------------------------
# ECS タスク
# ------------------------------------------------------------------------------

resource "aws_ecs_task_definition" "app" {
  # CPU とメモリ量の対応
  #   0.25 vCPU: .5, 1, 2 GB
  #    0.5 vCPU:  1 -   4 GB (1 刻み)
  #      1 vCPU:  2 -   8 GB (1 刻み)
  #      2 vCPU:  4 -  16 GB (1 刻み)
  #      4 vCPU:  8 -  30 GB (1 刻み)
  #      8 vCPU: 16 -  60 GB (4 刻み)
  #     16 vCPU: 32 - 120 GB (8 刻み)

  # NOTE: Fargate はコンテナを実行するためのインフラ管理を不要にする
  #   Docker コンテナであっても、それを実行するためにはコンテナをホストするためのサーバを構築し Docker Engine を導入するなどのインフラ整備が必要になる。
  #   Fargate はサーバレスのコンテナ実行サービスであり、インフラ管理を AWS に任せることができる。
  #   開発者は (ECS または EKS を介して) Docker イメージを実行するだけで良く、スケーリングも自動化できる。

  family                   = "${var.prefix}-ecs-app-task-definition"
  requires_compatibilities = ["FARGATE"] # タスクが動作するランタイム環境 {EC2|FARGATE|EXTERNAL}
  network_mode             = "awsvpc"    # 各タスクが独自の IP アドレスを持つ (Fargate では awsvpc のみ) {awsvpc|bridge|host|none}
  cpu                      = 256         # タスクに割り当てる CPU ユニット (256 = .25 vCPU)
  memory                   = 512         # タスクに割り当てる MB 単位メモリ量 (512 = .5 GB)
  tags                     = { Name = "${var.prefix}-ecs-app-task-definition" }

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn # タスクの実行に必要な IAM ロール
  container_definitions = templatefile("${path.module}/templates/task_definition-app.tpl", {
    container_name  = var.container_app_name
    container_port  = var.app_port
    container_image = "${aws_ecr_repository.app.repository_url}:${var.container_app_tag}"
    log_group       = aws_cloudwatch_log_group.app.name
    region          = data.aws_region.current.name
    db_port         = var.db_port
    db_name         = var.db_name
    db_username     = var.db_username
    db_password     = var.db_password
    db_address      = var.db_address
  })

  # Docker イメージのプラットフォームに合わせる
  # docker build --platform linux/amd64 の場合は下記になる
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  # コンテナ間で共有されるボリューム
  volume {
    name = "${var.prefix}-app-volume"
  }
}

# ------------------------------------------------------------------------------
# AutoScaling
# ------------------------------------------------------------------------------

resource "aws_appautoscaling_target" "app_scale_target" {
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  service_namespace  = "ecs"                      # 対象リソースが属する AWS 名前空間
  scalable_dimension = "ecs:service:DesiredCount" # スケールさせる属性 (desired_count)
  min_capacity       = var.min_container_count    # 最小タスク数 (スケールダウン時もこのタスク数は下回らない)
  max_capacity       = var.max_container_count    # 最大タスク数 (スケールアップ時もこのタスク数は上回らない)
  tags               = { Name = "${var.prefix}-ecs-app-scale-target" }
}

resource "aws_appautoscaling_policy" "app_scale_up" {
  name               = "${var.prefix}-ecs-app-scale-up"
  service_namespace  = aws_appautoscaling_target.app_scale_target.service_namespace
  resource_id        = aws_appautoscaling_target.app_scale_target.resource_id
  scalable_dimension = aws_appautoscaling_target.app_scale_target.scalable_dimension

  policy_type = "StepScaling"                    # スケーリングポリシー (メトリクス値によるスケールイン・スケールアウト)
  step_scaling_policy_configuration {            # ステップスケーリングの設定
    metric_aggregation_type = "Average"          # メトリクスの集計方法 (平均値)
    cooldown                = 60                 # スケーリングのクールダウン時間
    adjustment_type         = "ChangeInCapacity" # スケーリングの方法 (タスク数の調整)
    step_adjustment {                            # ステップスケーリングの調整方法
      scaling_adjustment          = 1            # 増減させるタスク数
      metric_interval_upper_bound = 0
    }
  }
}

resource "aws_appautoscaling_policy" "app_scale_down" {
  name               = "${var.prefix}-ecs-app-scale-down"
  service_namespace  = aws_appautoscaling_target.app_scale_target.service_namespace
  resource_id        = aws_appautoscaling_target.app_scale_target.resource_id
  scalable_dimension = aws_appautoscaling_target.app_scale_target.scalable_dimension

  policy_type = "StepScaling"                    # スケーリングポリシー (メトリクス値によるスケールイン・スケールアウト)
  step_scaling_policy_configuration {            # ステップスケーリングの設定
    metric_aggregation_type = "Average"          # メトリクスの集計方法 (平均値)
    cooldown                = 60                 # スケーリングのクールダウン時間
    adjustment_type         = "ChangeInCapacity" # スケーリングの方法 (タスク数の調整)
    step_adjustment {                            # ステップスケーリングの調整方法
      scaling_adjustment          = -1           # 増減させるタスク数
      metric_interval_upper_bound = 0
    }
  }
}

# ------------------------------------------------------------------------------
# CloudWatch
# ------------------------------------------------------------------------------

resource "aws_cloudwatch_log_group" "app" {
  name = "${var.prefix}-ecs-app-logs"
  tags = { Name = "${var.prefix}-ecs-app-logs" }
}

resource "aws_cloudwatch_metric_alarm" "app_cpu_high" {
  alarm_name          = "${var.prefix}-ecs-app-cpu-high"
  tags                = { Name = "${var.prefix}-ecs-app-cpu-high" }
  namespace           = "AWS/ECS"                       # メトリクスの名前空間
  metric_name         = "CPUUtilization"                # メトリクスの種類 (CPU 使用率)
  statistic           = "Average"                       # メトリクスの集計方法 (平均値)
  period              = "60"                            # メトリクスの取得間隔
  comparison_operator = "GreaterThanOrEqualToThreshold" # 評価方法 (閾値以上)
  evaluation_periods  = "1"                             # 評価回数
  threshold           = "80"                            # アラーム発動の閾値
  alarm_actions       = [aws_appautoscaling_policy.app_scale_up.arn]

  dimensions = { # 監視対象
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.app.name
  }
}

resource "aws_cloudwatch_metric_alarm" "app_cpu_low" {
  alarm_name          = "${var.prefix}-ecs-app-cpu-low"
  tags                = { Name = "${var.prefix}-ecs-app-cpu-low" }
  namespace           = "AWS/ECS"                    # メトリクスの名前空間
  metric_name         = "CPUUtilization"             # メトリクスの種類 (CPU 使用率)
  statistic           = "Average"                    # メトリクスの集計方法 (平均値)
  period              = "60"                         # メトリクスの取得間隔
  comparison_operator = "LessThanOrEqualToThreshold" # 評価方法 (閾値以下)
  evaluation_periods  = "1"                          # 評価回数
  threshold           = "20"                         # アラーム発動の閾値
  alarm_actions       = [aws_appautoscaling_policy.app_scale_down.arn]

  dimensions = { # 監視対象
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.app.name
  }
}
