# ------------------------------------------------------------------------------
# インターネットゲートウェイ
# ------------------------------------------------------------------------------

# インターネットゲートウェイはインバウンド、アウトバウンドの双方向が許可された外部との通信口である。
# VPC 内のリソースのインターネットアクセスを実現する際に用いられる。
# VPC 自体に外部通信を実現する機能はないためこれが必要であり、一つの VPC に一つのみアタッチできる。
# (VPC にアタッチされるが、正確には VPC 外に配置されるリソースである)
# NAT と異なり IP アドレスは変換されない。
# インターネットに接続するリソースは別途 public IP を振る必要がある。
# 本構成例では、public サブネットが配下のインスタンスに対し public IP を自動付与している。

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.prefix}-igw" }
}

# ------------------------------------------------------------------------------
# NAT ゲートウェイ
# ------------------------------------------------------------------------------

# NOTE: NAT は private IP を public IP に変換する仕組み
#   NAT により LAN 内の複数ホストは一つのグローバル IP を共有して外部にアクセスできる。
#   (NAT 自身はリクエスト元のホストごとに異なるポートを開いて外部に通信しているため、レスポンスを正しいホストに戻せる)
#   これを利用した NAT ゲートウェイはアウトバウンドのみが許可された通信口で、外部からのアクセスを遮断しつつインターネットアクセスを可能にする。
#   例えばプライベートサブネット内の EC2 や ECS がインターネットにアクセスしたり外部サービスを呼び出すために用いられる。

# NAT GW はパブリックサブネットに配置され、プライベートサブネットからの通信はルートテーブルで NAT GW に向けられる。
# NAT GW を通過するトラフィックは、固定のパブリック IP (Elastic IP) に変換され IGW を通してインターネットに送信される。
# (宛先が AWS 内のサービスの場合は IGW で折り返すため閉域通信となる)

# resource "aws_eip" "nat_a" {
#   domain = "vpc"
#   tags   = { Name = "${var.prefix}-nat-a-eip" }
# }
# resource "aws_nat_gateway" "public_a" {
#   allocation_id = aws_eip.nat_a.id
#   subnet_id     = aws_subnet.public_a.id
#   tags          = { Name = "${var.prefix}-public-a-ngw" }
# }

# resource "aws_eip" "nat_c" {
#   domain = "vpc"
#   tags   = { Name = "${var.prefix}-nat-c-eip" }
# }
# resource "aws_nat_gateway" "public_c" {
#   allocation_id = aws_eip.nat_c.id
#   subnet_id     = aws_subnet.public_c.id
#   tags          = { Name = "${var.prefix}-public-c-ngw" }
# }
