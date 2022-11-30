# パブリックサブネットは外部アクセスを要するリソースのみを配置する
# 一般的には ALB や NAT ゲートウェイ、踏み台用の EC2 などがこれに当たる
# 一方、AP サーバや DB サーバは直接アクセスを避けるためプライベートサブネットに配置する

resource "aws_subnet" "public_a" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "${data.aws_region.current.name}a"
  cidr_block        = var.cidrs["public_a"]
  tags              = { Name = "${var.prefix}-public-a-subnet" }

  # 配下のインスタンスにパブリック IP アドレスを付与する
  # (これにより IGW 経由で外から中への通信が可能になる)
  map_public_ip_on_launch = true
}

resource "aws_subnet" "public_c" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "${data.aws_region.current.name}c"
  cidr_block        = var.cidrs["public_c"]
  tags              = { Name = "${var.prefix}-public-c-subnet" }

  # 配下のインスタンスにパブリック IP アドレスを付与する
  # (これにより IGW 経由で外から中への通信が可能になる)
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "${data.aws_region.current.name}a"
  cidr_block        = var.cidrs["private_a"]
  tags              = { Name = "${var.prefix}-private-a-subnet" }
}

resource "aws_subnet" "private_c" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "${data.aws_region.current.name}c"
  cidr_block        = var.cidrs["private_c"]
  tags              = { Name = "${var.prefix}-private-c-subnet" }
}
