terraform {
  required_version = "1.4.7"
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
  backend "local" {}
}
