resource "aws_db_subnet_group" "rds" {
  name = "${var.prefix}-rds-subnet-group"
  tags = { Name = "${var.prefix}-rds-subnet-group" }

  # 異なる AZ のサブネットを 2 つ以上含める
  subnet_ids = [
    var.subnet_private_a_id,
    var.subnet_private_c_id,
  ]
}
