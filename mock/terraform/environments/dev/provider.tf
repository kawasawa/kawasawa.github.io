provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      Owner       = var.project_owner
      ManagedBy   = "Terraform"
    }
  }
}

provider "tls" {
}

provider "local" {
}
