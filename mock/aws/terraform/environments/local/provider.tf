provider "aws" {
  region = "ap-northeast-1"

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      Owner       = var.project_owner
      ManagedBy   = "Terraform"
    }
  }

  access_key = "dummy"
  secret_key = "secret"

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    acm                      = "http://localhost:4566"
    apigateway               = "http://localhost:4566"
    cloudformation           = "http://localhost:4566"
    cloudwatch               = "http://localhost:4566"
    config                   = "http://localhost:4566"
    dynamodb                 = "http://localhost:4566"
    ec2                      = "http://localhost:4566"
    es                       = "http://localhost:4566"
    events                   = "http://localhost:4566"
    firehose                 = "http://localhost:4566"
    iam                      = "http://localhost:4566"
    kinesis                  = "http://localhost:4566"
    kms                      = "http://localhost:4566"
    lambda                   = "http://localhost:4566"
    logs                     = "http://localhost:4566"
    opensearch               = "http://localhost:4566"
    redshift                 = "http://localhost:4566"
    resourcegroupstaggingapi = "http://localhost:4566"
    route53                  = "http://localhost:4566"
    route53resolver          = "http://localhost:4566"
    s3                       = "http://localhost:4566"
    s3control                = "http://localhost:4566"
    scheduler                = "http://localhost:4566"
    secretsmanager           = "http://localhost:4566"
    ses                      = "http://localhost:4566"
    sns                      = "http://localhost:4566"
    sqs                      = "http://localhost:4566"
    ssm                      = "http://localhost:4566"
    stepfunctions            = "http://localhost:4566"
    sts                      = "http://localhost:4566"
    swf                      = "http://localhost:4566"
    transcribe               = "http://localhost:4566"
  }
}

provider "tls" {
}

provider "local" {
}

provider "archive" {
}
