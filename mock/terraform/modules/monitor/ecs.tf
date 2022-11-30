# CloudWatch Logs から Lambda への送信
#   CloudWatch にはサブスクリプションフィルターと呼ばれるフィルタリングとログ転送を兼務する仕組みがある
resource "aws_cloudwatch_log_subscription_filter" "forward_log_filter_app" {
  name            = "${var.prefix}-lambda-forwardLog-filter-app"
  filter_pattern  = "{ $.severity = \"FATAL\" || $.severity = \"ERROR\" }"
  log_group_name  = var.cloudwatch_log_group_app_name
  destination_arn = aws_lambda_function.forward_log.arn
}

# CloudWatch Logs から Lambda へのアクセス権限
#   呼び出し元は正確には CloudWatch Logs 配下のログストリームになる
#   そのため、source_arn にはサブリソースも含めて許可するためワイルドカードを指定する
resource "aws_lambda_permission" "forward_log_permission_app" {
  # アクセス元
  principal  = "logs.ap-northeast-1.amazonaws.com"
  source_arn = "${var.cloudwatch_log_group_app_arn}:*"
  # アクセス先
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.forward_log.function_name
}
