resource "aws_security_group" "bastion" {
  vpc_id = var.vpc_main_id
  name   = "${var.prefix}-bastion-sg"
  tags   = { Name = "${var.prefix}-bastion-sg" }

  # SSH でのインバンドを許可
  ingress {
    protocol    = "tcp"
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  # RDS へのアウトバンドを許可
  egress {
    protocol  = "tcp"
    from_port = var.db_port
    to_port   = var.db_port
    cidr_blocks = [
      var.subnet_private_a_cidr_block,
      var.subnet_private_c_cidr_block,
    ]
  }
}
