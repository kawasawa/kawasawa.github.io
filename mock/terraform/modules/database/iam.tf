# モニタリング用ロール
resource "aws_iam_role" "rds_monitoring_role" {
  name = "${var.prefix}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "monitoring.rds.amazonaws.com",
        },
      },
    ],
  })
}

# 拡張モニタリング実行権限
resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring_policy" {
  role       = aws_iam_role.rds_monitoring_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}
