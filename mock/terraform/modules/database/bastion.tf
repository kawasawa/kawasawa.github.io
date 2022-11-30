# RDS はマネージドサービスであり DB と DBMS の管理を AWS に任せられる反面、
# それら以外の機能は持たず、SSH 等で外部からアクセスすることも出来ない
# DB 操作のため、間に EC2 で踏み台サーバを設ける構成が一般的である

# ------------------------------------------------------------------------------
# 踏み台サーバ用 EC2 インスタンス
# ------------------------------------------------------------------------------

resource "aws_instance" "bastion" {
  ami                     = data.aws_ami.al2023.id            # 使用する Amazon マシンイメージ
  instance_type           = "t2.micro"                        # t2.micro が無料利用枠の対象
  key_name                = aws_key_pair.bastion_key.key_name # SSH キー
  disable_api_termination = true                              # AWS コンソールからのインスタンス削除を禁止
  tags                    = { Name = "${var.prefix}-bastion" }
  volume_tags             = { Name = "${var.prefix}-bastion-volume" }

  subnet_id              = var.subnet_public_a_id
  vpc_security_group_ids = [aws_security_group.bastion.id]

  root_block_device {
    volume_type           = "gp3" # ボリュームのタイプ
    volume_size           = 2     # ボリュームのサイズ (GiB) 踏み台なので最小限で十分
    encrypted             = true  # ボリュームを暗号化 (AVD-AWS-0131 対応)
    delete_on_termination = true  # インスタンス終了時に削除
  }

  metadata_options {
    http_endpoint = "enabled"  # IMDS エンドポイントを有効化
    http_tokens   = "required" # IMDSv2 認証トークンを要求  (AVD-AWS-0026 対応)
  }
}

data "aws_ami" "al2023" {
  owners      = ["amazon"] # 公式のマシンイメージを取得
  most_recent = true       # 最新のマシンイメージを取得
  tags        = { Name = "${var.prefix}-al2023" }

  # Amazon Linux 2023 x86_64 を取得
  filter {
    name   = "name"
    values = ["al2023-ami-minimal-*-kernel-6.*-x86_64"]
  }
}

# ------------------------------------------------------------------------------
# 踏み台サーバ用セキュリティグループ
# ------------------------------------------------------------------------------

resource "aws_security_group" "bastion" {
  vpc_id = var.vpc_main_id
  name   = "${var.prefix}-bastion-sg"
  tags   = { Name = "${var.prefix}-bastion-sg" }

  # SSH でのインバンドを許可
  ingress {
    protocol  = "tcp" # SSH は TCP プロトコルで転送される
    from_port = 22    # SSH のポート番号
    to_port   = 22    # SSH のポート番号
    # trivy:ignore:AVD-AWS-0107: すべての IP アドレスからのインバウンドを許可
    cidr_blocks = ["0.0.0.0/0"] # ここでは開放しているが、本当は踏み台サーバへのアクセスは制限したい
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

# ------------------------------------------------------------------------------
# 踏み台サーバ用 SSH キーペア
# ------------------------------------------------------------------------------

# 生成アルゴリズムを指定
resource "tls_private_key" "generator" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# 公開鍵をキーペアに登録
resource "aws_key_pair" "bastion_key" {
  public_key = tls_private_key.generator.public_key_openssh
  key_name   = "${var.prefix}-bastion-key"
  tags       = { Name = "${var.prefix}-bastion-key" }
}

# 秘密鍵をシークレットに登録
resource "aws_secretsmanager_secret" "bastion" {
  name = "${var.prefix}-bastion-secret"
  tags = { Name = "${var.prefix}-bastion-secret" }
}
resource "aws_secretsmanager_secret_version" "bastion" {
  secret_id     = aws_secretsmanager_secret.bastion.id
  secret_string = tls_private_key.generator.private_key_pem
}
