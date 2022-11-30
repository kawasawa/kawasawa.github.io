# Lambda が使用するコードのアーカイブ
data "archive_file" "forward_log" {
  type        = "zip"
  source_dir  = "${path.module}/src"
  output_path = "${path.module}/src/forward_log.zip"
}

# Lambda 関数
resource "aws_lambda_function" "forward_log" {
  # アーカイブファイル (zip) のハッシュ値を比較し、変更があればデプロイする (つまりソースに変更があるときだけデプロイする)
  # Lambda には zip が送信され、Lambda 側で解答される
  function_name    = "${var.prefix}-lambda-forwardLog"
  tags             = { Name = "${var.prefix}-lambda-forwardLog" }
  role             = aws_iam_role.lambda_monitoring_role.arn
  filename         = data.archive_file.forward_log.output_path
  source_code_hash = data.archive_file.forward_log.output_base64sha256
  runtime          = "nodejs18.x"
  handler          = "forward_log.handler"

  environment {
    variables = {
      ENVIRONMENT       = var.environment
      ALERT_WEBHOOK_URL = var.alert_webhook_url
    }
  }
}

# Lambda が使用するロググループ
#   これだけでは書き込みできないため別途 IAM の設定が必要
resource "aws_cloudwatch_log_group" "forward_log" {
  name              = "/aws/lambda/${aws_lambda_function.forward_log.function_name}"
  tags              = { Name = "/aws/lambda/${aws_lambda_function.forward_log.function_name}" }
  retention_in_days = 7
}
