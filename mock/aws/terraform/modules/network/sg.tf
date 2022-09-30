# ------------------------------------------------------------------------------
# VPC エンドポイント用セキュリティグループ
# ------------------------------------------------------------------------------

resource "aws_security_group" "vpce" {
  vpc_id = aws_vpc.main.id
  name   = "${var.prefix}-vpce-sg"
  tags   = { Name = "${var.prefix}-vpce-sg" }

  # HTTPS でのインバウンドを許可 (ECS から ECR への通信)
  ingress {
    protocol  = "tcp"
    from_port = 443
    to_port   = 443
    cidr_blocks = [
      aws_subnet.private_a.cidr_block,
      aws_subnet.private_c.cidr_block,
    ]
  }

  # すべてのアウトバウンドを許可
  egress {
    protocol  = "-1"
    from_port = 0
    to_port   = 0
    # trivy:ignore:AVD-AWS-0104: すべての IP アドレスに対するアウトバウンドを許可
    cidr_blocks = ["0.0.0.0/0"]
  }
}
