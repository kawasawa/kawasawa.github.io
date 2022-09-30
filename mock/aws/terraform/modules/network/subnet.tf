# AWS のリージョンとアベイラビリティゾーン
#   - リージョン
#     AWS のデータセンター (サーバ群) は世界中のリージョン (地域) に配置されている
#     リージョンごとに使用可能なサービスや価格が若干異なり、日本では提供されていないものもある
#     日本には東京 (ap-northeast-1) と大阪 (ap-northeast-3) のリージョンがある (2 は韓国ソウル)
#   - アベイラビリティゾーン (AZ)
#     リージョンは地理的に分離された複数のアベイラビリティゾーン (AZ) から成り、データセンターの設備が分散配置されているようだ
#     東京リージョンには a, c, d の AZ が存在する (過去には b も存在した模様、この辺りはリージョンごとに異なる)
#     複数の AZ にリソースを分散させること冗長化を図ることが出来る (本例でも ECS や RDS はマルチ AZ で展開している)


# ------------------------------------------------------------------------------
# パブリックサブネット
# ------------------------------------------------------------------------------

# パブリックサブネットは外部アクセスを要するリソースのみを配置する
# 具体的には ALB や NAT ゲートウェイ、踏み台サーバ等がこれに当たる
# 一方、AP サーバや DB サーバは直接的なアクセスを避けるためプライベートサブネットに配置する

resource "aws_subnet" "public_a" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "${var.region}a"
  cidr_block        = var.cidrs["public_a"]
  tags              = { Name = "${var.prefix}-public-a-subnet" }

  # 配下の EC2 インスタンスにパブリック IP アドレスを付与する
  # これにより IGW 経由で外から中への通信が可能になる
  #   多少語弊はあるものの適用されるのは EC2 だけと考えて良い
  #   NGW には付与されないので Elastic IP が必要である
  #   そのほか、ALB は AWS 側で動的に管理される (なのでアドレスの固定ができない、NLB は可能だが)
  map_public_ip_on_launch = true
}

resource "aws_subnet" "public_c" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "${var.region}c"
  cidr_block        = var.cidrs["public_c"]
  tags              = { Name = "${var.prefix}-public-c-subnet" }

  # 配下の EC2 インスタンスにパブリック IP アドレスを付与する
  # これにより IGW 経由で外から中への通信が可能になる
  #   多少語弊はあるものの適用されるのは EC2 だけと考えて良い
  #   NGW には付与されないので Elastic IP が必要である
  #   そのほか、ALB は AWS 側で動的に管理される (なのでアドレスの固定ができない、NLB は可能だが)
  map_public_ip_on_launch = true
}

# ------------------------------------------------------------------------------
# プライベートサブネット
# ------------------------------------------------------------------------------

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "${var.region}a"
  cidr_block        = var.cidrs["private_a"]
  tags              = { Name = "${var.prefix}-private-a-subnet" }
}

resource "aws_subnet" "private_c" {
  vpc_id            = aws_vpc.main.id
  availability_zone = "${var.region}c"
  cidr_block        = var.cidrs["private_c"]
  tags              = { Name = "${var.prefix}-private-c-subnet" }
}
