# 生成アルゴリズムを指定
resource "tls_private_key" "generator" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# 秘密鍵をローカル生成
resource "local_file" "private_key" {
  content  = tls_private_key.generator.private_key_pem
  filename = local.private_key
  provisioner "local-exec" {
    command = "chmod 600 ${local.private_key}"
  }
}

# 公開鍵をローカル生成
resource "local_file" "public_key" {
  content  = tls_private_key.generator.public_key_openssh
  filename = local.public_key
  provisioner "local-exec" {
    command = "chmod 600 ${local.public_key}"
  }
}

# 公開鍵を AWS に登録
resource "aws_key_pair" "bastion_key" {
  public_key = tls_private_key.generator.public_key_openssh
  key_name   = "${var.prefix}-bastion-key"
}
