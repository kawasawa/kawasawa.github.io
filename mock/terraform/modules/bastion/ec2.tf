resource "aws_instance" "bastion" {
  ami           = data.aws_ami.al2023.id            # 使用する Amazon マシンイメージ
  instance_type = "t2.micro"                        # t2.micro が無料利用枠の対象
  key_name      = aws_key_pair.bastion_key.key_name # SSH キー
  tags          = { Name = "${var.prefix}-bastion" }
  volume_tags   = { Name = "${var.prefix}-bastion-volume" }

  subnet_id              = var.subnet_public_a_id
  vpc_security_group_ids = [aws_security_group.bastion.id]
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
