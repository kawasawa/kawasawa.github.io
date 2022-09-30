# Lambda 用の IAM ロールを定義
resource "aws_iam_role" "lambda_monitoring_role" {
  name = "${var.prefix}-lambda-monitoring-role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "lambda.amazonaws.com",
        },
      },
    ],
  })
}

# Lambda から CloudWatch Logs へのアクセス権限
resource "aws_iam_role_policy" "lambda_access_policy" {
  name = "${var.prefix}-lambda-access-policy"
  role = aws_iam_role.lambda_monitoring_role.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "logs:CreateLogStream",
          "logs:CreateLogGroup",
          "logs:PutLogEvents",
        ],
        "Effect" : "Allow",
        "Resource" : "arn:aws:logs:${var.region}:${var.account_id}:log-group:/aws/lambda/${var.prefix}-*:*",
      },
    ],
  })
}
