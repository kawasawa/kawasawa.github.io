terraform {
  # 使用する Terraform のバージョンを指定
  required_version = "1.4.7"

  # 使用するプロバイダのバージョンを指定
  #   併せて provider.tf ファイルにもプロバイダ定義を設ける
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.77.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "4.0.4"
    }
    local = {
      source  = "hashicorp/local"
      version = "2.4.1"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "2.4.2"
    }
  }

  # tfstate の保管先を指定
  backend "s3" {
    key     = "terraform.tfstate"
    encrypt = true

    # 下記項目は実行時にシェルから引き渡す
    # bucket         = ""
    # dynamodb_table = ""
    # region         = ""
  }
}
