# NOTE: AWS のグローバルリソースにアクセスする用途であれば VPC エンドポイントを採用したい
#   VPC EP はインターネットではなく AWS サービスへアクセスするためのエンドポイントを提供する仕組みである
#   したがって NAT GW と違い Elastic IP が必要無い
#   そのほか、NAT GW は専用の NAT インスタンスが提供されるため (要するに外に出るための専用線ということになる) 利用するサービスが少ない場合ランニングコストの方が高くつく
#   ただし、VPC エンドポイントは数が増えるごとにコストが増加するため、利用サービス数が多い場合は NAT GW の方が安くなる
#   また、VPC EP は比較的新しいサービスであり、そもそもエンドポイントが未提供のグローバルリソースもまだ存在する

# VPC エンドポイントにはいくつかの種類がある
#  - インターフェイスエンドポイント
#      対象: AWS サービス全般 (基本的にはこちらを使用)
#      概要: サブネットから AWS のサービスに接続する ENI (Elastic Network Interface) が提供されプライベート IP で通信される (PrivateLink)
#      料金: 有料
#  - ゲートウェイエンドポイント
#      対象: S3, DynamoDB
#      概要: AWS 内のネットワークを介しルートテーブルに登録された経路で (一応パブリック IP) 直接接続する (大量トラフィックを捌けるように設計されており、ボトルネックになりうる ENI を排除している)
#      料金: 無料

# ECR いくつかの要素で構成されている
#  - ECR API: 認証 (GetAuthorizationToken) 等を取得するための API を提供
#      ECR が IAM 権限等をチェックし、認証トークンを払い出す
#      これを使って Docker レジストリに docker login している
#  - ECR DKR: Docker イメージのメタデータやマニュフェスト、レイヤー情報 (実際に格納されている S3 の URL) を格納
#      ECS からの docker pull の際に、まずマニュフェスト情報を返却される
#      マニュフェスト情報の中にレイヤーのハッシュ値が入っているので、ECS はその値で署名付き URL をリクエストする
#  - S3: 実際のイメージレイヤーを格納
#      ECS は署名付き URL で S3 にアクセスしイメージレイヤーを取得する

# ------------------------------------------------------------------------------
# ECR API 用 VPC インターフェイスエンドポイント
# ------------------------------------------------------------------------------

resource "aws_vpc_endpoint" "ecr_api" {
  vpc_endpoint_type   = "Interface"
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.region}.ecr.api"
  tags                = { Name = "${var.prefix}-vpce-ecr-api" }
  private_dns_enabled = true

  subnet_ids = [
    aws_subnet.private_a.id,
    aws_subnet.private_c.id,
  ]

  security_group_ids = [
    aws_security_group.vpce.id,
  ]
}

# ------------------------------------------------------------------------------
# ECR Docker Registry 用 VPC インターフェイスエンドポイント
# ------------------------------------------------------------------------------

resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_endpoint_type   = "Interface"
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.region}.ecr.dkr"
  tags                = { Name = "${var.prefix}-vpce-ecr-dkr" }
  private_dns_enabled = true

  subnet_ids = [
    aws_subnet.private_a.id,
    aws_subnet.private_c.id,
  ]

  security_group_ids = [
    aws_security_group.vpce.id,
  ]
}

# ------------------------------------------------------------------------------
# S3 Image Layer 用 VPC ゲートウェイエンドポイント
# ------------------------------------------------------------------------------

resource "aws_vpc_endpoint" "s3" {
  vpc_endpoint_type = "Gateway"
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${var.region}.s3"
  tags              = { Name = "${var.prefix}-vpce-s3" }

  route_table_ids = [
    aws_route_table.private_a.id,
    aws_route_table.private_c.id,
  ]
}

# ------------------------------------------------------------------------------
# CloudWatch Logs 用 VPC インターフェイスエンドポイント
# ------------------------------------------------------------------------------

resource "aws_vpc_endpoint" "logs" {
  vpc_endpoint_type   = "Interface"
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.region}.logs"
  tags                = { Name = "${var.prefix}-vpce-logs" }
  private_dns_enabled = true

  subnet_ids = [
    aws_subnet.private_a.id,
    aws_subnet.private_c.id,
  ]

  security_group_ids = [
    aws_security_group.vpce.id,
  ]
}
