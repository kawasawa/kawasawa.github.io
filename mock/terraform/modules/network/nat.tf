# NAT はプライベート IP をパブリック IP に変換する仕組みで、これを利用した NAT ゲートウェイはアウトバウンドのみが許可された外部との通信口である。
# 外部からのアクセスを遮断しつつインターネットアクセスを可能にする際に用いられ、
# 例えばプライベートサブネット内の EC2 や ECS が外部サービスを呼び出すために用意される。
# NAT ゲートウェイを通過するトラフィックは、固定のパブリック IP (Elastic IP) に変換されて外部に送信される。

# ------------------------------------------------------------------------------
# NAT ゲートウェイ (a)
# ------------------------------------------------------------------------------

resource "aws_eip" "nat_a" {
  domain = "vpc"
  tags   = { Name = "${var.prefix}-nat-a-eip" }
}
resource "aws_nat_gateway" "public_a" {
  allocation_id = aws_eip.nat_a.id
  subnet_id     = aws_subnet.public_a.id
  tags          = { Name = "${var.prefix}-public-a-ngw" }
}

# ------------------------------------------------------------------------------
# NAT ゲートウェイ (c)
# ------------------------------------------------------------------------------

resource "aws_eip" "nat_c" {
  domain = "vpc"
  tags   = { Name = "${var.prefix}-nat-c-eip" }
}
resource "aws_nat_gateway" "public_c" {
  allocation_id = aws_eip.nat_c.id
  subnet_id     = aws_subnet.public_c.id
  tags          = { Name = "${var.prefix}-public-c-ngw" }
}
