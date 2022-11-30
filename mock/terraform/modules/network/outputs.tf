# ******************************************************************************
# 戻り値
# ******************************************************************************

output "vpc_main_id" {
  value       = aws_vpc.main.id
  description = "VPC ID"
}

output "subnet_public_a_id" {
  value       = aws_subnet.public_a.id
  description = "パブリックサブネット A の ID"
}
output "subnet_public_a_cidr_block" {
  value       = aws_subnet.public_a.cidr_block
  description = "パブリックサブネット A の CIDR ブロック"
}
output "subnet_public_c_id" {
  value       = aws_subnet.public_c.id
  description = "パブリックサブネット C の ID"
}
output "subnet_public_c_cidr_block" {
  value       = aws_subnet.public_c.cidr_block
  description = "パブリックサブネット C の CIDR ブロック"
}
output "subnet_private_a_id" {
  value       = aws_subnet.private_a.id
  description = "プライベートサブネット A の ID"
}
output "subnet_private_a_cidr_block" {
  value       = aws_subnet.private_a.cidr_block
  description = "プライベートサブネット A の CIDR ブロック"
}
output "subnet_private_c_id" {
  value       = aws_subnet.private_c.id
  description = "プライベートサブネット C の ID"
}
output "subnet_private_c_cidr_block" {
  value       = aws_subnet.private_c.cidr_block
  description = "プライベートサブネット C の CIDR ブロック"
}
