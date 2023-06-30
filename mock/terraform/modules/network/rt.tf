# VPC 内部宛て (local) のルートは VPC 自身がルーティングするため定義不要 (全ルートテーブルに自動で local ルートが登録される)
# SEE: https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/VPC_Route_Tables.html
# `VPC 内のターゲットに向けられたすべてのトラフィック (10.0.0.0/16) には local ルートが適用されるため、VPC 内でルーティングされます。
#  サブネットからのその他のすべてのトラフィックでは、インターネットゲートウェイが使用されます。`

# ------------------------------------------------------------------------------
# パブリックサブネット (a)
# ------------------------------------------------------------------------------

resource "aws_route_table" "public_a" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.prefix}-public-a-rt" }
}
resource "aws_route_table_association" "public_a" {
  route_table_id = aws_route_table.public_a.id
  subnet_id      = aws_subnet.public_a.id
}

# インターネットゲートウェイ経由で外部とのアクセスを許可
# (このルートはパブリックサブネットに配置される ALB が内部リソースのレスポンスをリクエスト元に返却するためにも必要となる)
resource "aws_route" "public_a" {
  route_table_id         = aws_route_table.public_a.id
  gateway_id             = aws_internet_gateway.main.id
  destination_cidr_block = "0.0.0.0/0"
}

# ------------------------------------------------------------------------------
# パブリックサブネット (c)
# ------------------------------------------------------------------------------

resource "aws_route_table" "public_c" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.prefix}-public-c-rt" }
}
resource "aws_route_table_association" "public_c" {
  route_table_id = aws_route_table.public_c.id
  subnet_id      = aws_subnet.public_c.id
}

# インターネットゲートウェイ経由で外部とのアクセスを許可
# (このルートはパブリックサブネットに配置される ALB が内部リソースのレスポンスをリクエスト元に返却するためにも必要となる)
resource "aws_route" "public_c" {
  route_table_id         = aws_route_table.public_c.id
  gateway_id             = aws_internet_gateway.main.id
  destination_cidr_block = "0.0.0.0/0"
}

# ------------------------------------------------------------------------------
# プライベートサブネット (a)
# ------------------------------------------------------------------------------

resource "aws_route_table" "private_a" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.prefix}-private-a-rt" }
}
resource "aws_route_table_association" "private_a" {
  route_table_id = aws_route_table.private_a.id
  subnet_id      = aws_subnet.private_a.id
}

# NAT ゲートウェイ経由で外へのアクセスを許可
# (ECS が ECR からイメージを pull する際に通過する)
resource "aws_route" "private_a" {
  route_table_id         = aws_route_table.private_a.id
  nat_gateway_id         = aws_nat_gateway.public_a.id
  destination_cidr_block = "0.0.0.0/0"
}

# ------------------------------------------------------------------------------
# プライベートサブネット (c)
# ------------------------------------------------------------------------------

resource "aws_route_table" "private_c" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.prefix}-private-c-rt" }
}
resource "aws_route_table_association" "private_c" {
  route_table_id = aws_route_table.private_c.id
  subnet_id      = aws_subnet.private_c.id
}

# NAT ゲートウェイ経由で外へのアクセスを許可
# (ECS が ECR からイメージを pull する際に通過する)
resource "aws_route" "private_c" {
  route_table_id         = aws_route_table.private_c.id
  nat_gateway_id         = aws_nat_gateway.public_c.id
  destination_cidr_block = "0.0.0.0/0"
}
