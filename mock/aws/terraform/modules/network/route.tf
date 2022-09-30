# VPC 内のリソース同士の通信は local ルートによって処理させるため定義は不要
#   see: https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/VPC_Route_Tables.html
#   `VPC 内のターゲットに向けられたすべてのトラフィック (10.0.0.0/16) には local ルートが適用されるため、VPC 内でルーティングされます。
#    サブネットからのその他のすべてのトラフィックでは、インターネットゲートウェイが使用されます。`

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

# インターネットゲートウェイ経由で双方向通信の経路を構築
#   セキュリティグループではリクエストに対するレスポンスは設定不要で許可されるが、ルートテーブルで道を開けておかないと通信できない
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

# インターネットゲートウェイ経由で双方向通信の経路を構築
#   セキュリティグループではリクエストに対するレスポンスは設定不要で許可されるが、ルートテーブルで道を開けておかないと通信できない
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

# プライベートサブネット内からの通信であることをルートテーブルに登録
resource "aws_route_table_association" "private_a" {
  route_table_id = aws_route_table.private_a.id
  subnet_id      = aws_subnet.private_a.id
}
# ルートテーブルに NAT ゲートウェイを登録し外部への通信経路を構築
#   これらによりプライベートサブネットから外部へのアクセスが可能になる
#   (もし NAT GW 経由で ECS が ECR から Docker イメージを pull するのであれば必要になる)
# resource "aws_route" "private_internet_out_a" {
#   route_table_id         = aws_route_table.private_a.id
#   nat_gateway_id         = aws_nat_gateway.public_a.id
#   destination_cidr_block = "0.0.0.0/0"
# }


# ------------------------------------------------------------------------------
# プライベートサブネット (c)
# ------------------------------------------------------------------------------

resource "aws_route_table" "private_c" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.prefix}-private-c-rt" }
}

# プライベートサブネット内からの通信であることをルートテーブルに登録
resource "aws_route_table_association" "private_c" {
  route_table_id = aws_route_table.private_c.id
  subnet_id      = aws_subnet.private_c.id
}
# ルートテーブルに NAT ゲートウェイを登録し外部への通信経路を構築
#   これらによりプライベートサブネットから外部へのアクセスが可能になる
#   (もし NAT GW 経由で ECS が ECR から Docker イメージを pull するのであれば必要になる)
# resource "aws_route" "private_c" {
#   route_table_id         = aws_route_table.private_c.id
#   nat_gateway_id         = aws_nat_gateway.public_c.id
#   destination_cidr_block = "0.0.0.0/0"
# }
