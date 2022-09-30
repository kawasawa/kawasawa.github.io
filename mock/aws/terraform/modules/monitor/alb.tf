# ALB ヘルスチェックアラームと Lambda の呼び出し
resource "aws_cloudwatch_metric_alarm" "alb_unhealthy_count" {
  alarm_name = "${var.prefix}-alb-unhealthy-count"
  tags       = { Name = "${var.prefix}-alb-unhealthy-count" }

  # ALBの非正常ホスト数を、60秒置きに集計し、集計期間内の最小値を求め、その値が1以上であればアラームを発火する
  namespace           = "AWS/ApplicationELB"            # 集計対象の名前空間
  metric_name         = "UnHealthyHostCount"            # 集計対象のメトリクス
  statistic           = "Minimum"                       # 集計方法
  period              = "60"                            # 集計間隔
  evaluation_periods  = "1"                             # 評価範囲 (直近の何回分の period を評価するか)
  datapoints_to_alarm = "1"                             # 閾値超過回数 (評価された値のうちアラームの発動に必要な閾値を超過した回数、未指定の場合は 0 となり evaluation_periods と同じ値として解釈される)
  threshold           = "1"                             # 閾値
  comparison_operator = "GreaterThanOrEqualToThreshold" # 閾値の比較方法

  # 監視対象
  dimensions = {
    LoadBalancer = var.alb_arn_suffix
    TargetGroup  = var.alb_target_group_app_arn_suffix
  }

  # アクション
  # NOTE: CloudWatch から Lambda を呼び出す
  #   従来はアラームの通知機能によって SNS (Simple Notification Service) を経由して呼び出していたが、
  #   新たに "Lambda アクション" が追加され直接関数を呼び出せるようになった
  alarm_actions = [
    aws_lambda_function.forward_log.arn
  ]
}

# CloudWatch Alarms から Lambda へのアクセス権限
#   アラームから直接 Lambda を呼び出すため ECS のログストリームとはプリンシパルが異なる
resource "aws_lambda_permission" "forward_log_permission_alb_user" {
  # アクセス元
  principal  = "lambda.alarms.cloudwatch.amazonaws.com"
  source_arn = aws_cloudwatch_metric_alarm.alb_unhealthy_count.arn
  # アクセス先
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.forward_log.function_name
}
