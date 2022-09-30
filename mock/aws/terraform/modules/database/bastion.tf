# RDS はマネージドサービスであり DB と DBMS の管理を AWS に任せられる反面、
# それら以外の機能は持たず、SSH 等で外部からアクセスすることも出来ない
# DB 操作のため、間に EC2 で踏み台サーバを設ける構成が一般的である

# ------------------------------------------------------------------------------
# 踏み台サーバ用 EC2 インスタンス
# ------------------------------------------------------------------------------

resource "aws_instance" "bastion" {
  ami = !local.is_local ? data.aws_ami.al2023[0].id : "ami-12345678" # 使用する Amazon マシンイメージ

  instance_type           = "t2.micro"                        # ※ 無料利用枠: t2.micro
  key_name                = aws_key_pair.bastion_key.key_name # SSH キー
  disable_api_termination = true                              # AWS コンソールからのインスタンス削除を禁止
  tags                    = { Name = "${var.prefix}-bastion" }
  volume_tags             = { Name = "${var.prefix}-bastion-volume" }

  subnet_id              = var.subnet_public_a_id
  vpc_security_group_ids = [aws_security_group.bastion.id]

  root_block_device {
    volume_type           = "gp3" # ボリュームのタイプ
    volume_size           = 2     # ボリュームのサイズ (GiB), 踏み台なので最小限で十分 ※ 無料利用枠: 30GiB 以下
    encrypted             = true  # ボリュームを暗号化 (AVD-AWS-0131 対応)
    delete_on_termination = true  # インスタンス終了時に削除
  }

  metadata_options {
    http_endpoint = "enabled"  # IMDS エンドポイントを有効化
    http_tokens   = "required" # IMDSv2 認証トークンを要求  (AVD-AWS-0026 対応)
  }
}

data "aws_ami" "al2023" {
  count = !local.is_local ? 1 : 0 # 実際の AWS 環境のみでリソース作成

  owners      = ["amazon"] # 公式のマシンイメージを取得
  most_recent = true       # 最新のマシンイメージを取得 (Terraform が差分を検知する頻度は上がるが、最新のセキュリティパッチを適用したい)
  tags        = { Name = "${var.prefix}-al2023" }

  # 選択肢に含めるマシンイメージを絞り込む
  #   OS: Amazon Linux 2023 (AL2023) は AL2 の後継機
  #   構成: AL2023 には標準構成と最小構成 (minimal) が存在し、最小構成は基本コマンドも省かれるため非常に軽量
  #   カーネル: 現時点では kernel-6 系が最新だが、アップデートで更新される可能性があるため、kernel は絞り込まない
  #   命令セット: インスタンスタイプに t2.micro を指定できる x86_64 アーキテクチャを選択 (現時点では Arm からは指定できない)
  filter {
    name   = "name"
    values = ["al2023-ami-minimal-*-x86_64"]
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

# NOTE: 公開鍵認証による SSH 接続
#   公開鍵による暗号化は HTTPS などで用いられる方式で、ブラウザとサーバが通信する際、始めにブラウザはサーバの公開鍵を使いセッションキー (共通鍵) を暗号化して送信、
#   サーバは自身の秘密鍵を使ってセッションキーを復号、移行の通信では両者がそのセッションキーを使って暗号化通信を行う。
#   公開鍵による認証はこの仕組みを応用しており、ログイン先のサーバがクライアントに対して発行するチャレンジ要求 (ランダムデータを送信し署名を求める) に対して、
#   クライアントが自身の秘密鍵で署名してレスポンス、サーバは事前に (EC2 KeyPair などを経由して) 渡されたクライアントの公開鍵 (検証鍵) で署名を検証する。
#   HTTPS はサーバ側が自身とのやり取りの秘匿性を高める（≒暗号化）目的があり、SSH はクライアントが自身の正当性を示す（≒認証）目的がある。
#   公開鍵暗号技術の代表的なアルゴリズムには RSA や楕円曲線暗号 (ECDSA) がある。

# 生成アルゴリズムを指定
#   128 ビットセキュリティを満たすには RSA の場合 3072 bits 以上が要求される
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
#   踏み台サーバ接続時にクライアントが手動で取得する想定
resource "aws_secretsmanager_secret" "bastion" {
  name = "${var.prefix}-bastion-secret"
  tags = { Name = "${var.prefix}-bastion-secret" }
}
resource "aws_secretsmanager_secret_version" "bastion" {
  secret_id     = aws_secretsmanager_secret.bastion.id
  secret_string = tls_private_key.generator.private_key_pem
}
