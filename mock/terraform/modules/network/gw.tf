# ------------------------------------------------------------------------------
# インターネットゲートウェイ
# ------------------------------------------------------------------------------

# インターネットゲートウェイはインバウンド、アウトバウンドの双方向が許可された外部との通信口である。
# VPC 内に一つのみ配置でき、VPC 内のパブリックリソースのインターネットアクセスを可能にする際に用いられる。
# NAT と異なり IP アドレスは変換されないため、対象のリソースは直接インターネットに接続するためにパブリック IP が振られている必要がある。
# 本構成例では、VPC 内のパブリックサブネットで配下のインスタンスに対しパブリック IP を自動付与している。

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.prefix}-igw" }
}

# ------------------------------------------------------------------------------
# NAT ゲートウェイ
# ------------------------------------------------------------------------------

# NAT はプライベート IP をパブリック IP に変換する仕組みで、これを利用した NAT ゲートウェイはアウトバウンドのみが許可された外部との通信口である。
# 外部からのアクセスを遮断しつつインターネットアクセスを可能にする際に用いられ、
# 例えばプライベートサブネット内の EC2 や ECS が外部サービスを呼び出すために用意される。
# NAT ゲートウェイを通過するトラフィックは、固定のパブリック IP (Elastic IP) に変換されて外部に送信される。

# AWS のグローバルリソースにアクセスする方法として NAT GW のほかに VPC エンドポイントもある
# ただし、VPC エンドポイントはアクセス先の AWS サービスから提供されるもので、中にはエンドポイントが未提供のものもある

resource "aws_eip" "nat_a" {
  domain = "vpc"
  tags   = { Name = "${var.prefix}-nat-a-eip" }
}
resource "aws_nat_gateway" "public_a" {
  allocation_id = aws_eip.nat_a.id
  subnet_id     = aws_subnet.public_a.id
  tags          = { Name = "${var.prefix}-public-a-ngw" }
}

resource "aws_eip" "nat_c" {
  domain = "vpc"
  tags   = { Name = "${var.prefix}-nat-c-eip" }
}
resource "aws_nat_gateway" "public_c" {
  allocation_id = aws_eip.nat_c.id
  subnet_id     = aws_subnet.public_c.id
  tags          = { Name = "${var.prefix}-public-c-ngw" }
}
