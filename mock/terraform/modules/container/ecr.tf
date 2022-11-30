# ------------------------------------------------------------------------------
# ECR リポジトリ
# ------------------------------------------------------------------------------

resource "aws_ecr_repository" "app" {
  image_tag_mutability = "MUTABLE" # 同一タグによるイメージの上書きを許可
  force_delete         = true      # イメージを含む状態でもリポジトリの削除を許可
  name                 = "${var.prefix}-ecr-app"
  tags                 = { Name = "${var.prefix}-ecr-app" }

  image_scanning_configuration {
    scan_on_push = true # 脆弱性の検証を実施
  }
}

# ------------------------------------------------------------------------------
# Docker イメージのライフサイクル
# ------------------------------------------------------------------------------

resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name

  policy = jsonencode({
    "rules" : [
      {
        "rulePriority" : 1,
        "description" : "タグが無いイメージは指定日後に削除する",
        "selection" : {
          "tagStatus" : "untagged",
          "countType" : "sinceImagePushed",
          "countUnit" : "days",
          "countNumber" : 7,
        },
        "action" : {
          "type" : "expire",
        },
      },
    ],
  })
}
