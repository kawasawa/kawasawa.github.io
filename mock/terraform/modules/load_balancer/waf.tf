resource "aws_wafv2_web_acl" "alb" {
  name  = "${var.prefix}-alb-waf"
  scope = "REGIONAL"

  # いずれのルールにもマッチしない場合、リクエストを許可する
  default_action {
    allow {}
  }

  visibility_config {
    metric_name                = "${var.prefix}-alb-waf-metric"
    cloudwatch_metrics_enabled = true
    sampled_requests_enabled   = false
  }

  # 100 万件リクエストにつき USD 0.60 かかる
  # 総キャパシティ 1500 WCU を超えると追加料金が発生する
  #   WCU = Web ACL Capacity Unit
  #   ACL = Access Control List
  # see: https://aws.amazon.com/jp/waf/pricing/

  # 独自ルール (流量制限: 2 WCU ※AWSコンソールで確認したところ)
  rule {
    name     = "RateBasedRule"
    priority = 1

    # このルールにマッチした場合、リクエストをブロックする
    action {
      block {}
    }

    # `evaluation_window_sec` は hashicorp/aws 5.40.0 以降でサポートされる
    # see: https://github.com/hashicorp/terraform-provider-aws/releases/tag/v5.40.0
    statement {
      rate_based_statement {
        limit                 = 300  # リクエスト回数の上限
        evaluation_window_sec = 60   # 集計間隔 (秒)
        aggregate_key_type    = "IP" # 集計単位 (送信元 IP アドレス)
      }
    }

    visibility_config {
      metric_name                = "${var.prefix}-RateBasedRule-metric"
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = false
    }
  }

  # AWS managed rule groups (Core rule set: 700 WCU)
  #   ウェブアプリケーションに一般的に適用可能なルールを含んでいます。
  #   これは、OWASP の出版物に記述されているものを含む、広範な脆弱性の悪用に対する防御を提供します。
  # see: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-crs
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 10

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"

        # 通常の閲覧時にも EC2MetaDataSSRF_COOKIE が反応するパターンがあるため除外している
        # が、これはクライアントの端末あるいはブラウザの設定に原因があるため、安全を期すなら有効化したいところ
        rule_action_override {
          name = "EC2MetaDataSSRF_COOKIE"
          action_to_use {
            count {}
          }
        }
      }
    }

    visibility_config {
      metric_name                = "${var.prefix}-AWSManagedRulesCommonRuleSet-metric"
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = false
    }
  }

  # AWS managed rule groups (Known bad inputs: 200 WCU)
  #   無効であることが知られており、脆弱性の悪用や発見に関連するリクエストパターンをブロックするためのルールが含まれています。
  #   これにより、悪意ある行為者が脆弱なアプリケーションを発見するリスクを低減することができます。
  # see: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-known-bad-inputs
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 20

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      metric_name                = "${var.prefix}-AWSManagedRulesKnownBadInputsRuleSet-metric"
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = false
    }
  }

  # AWS managed rule groups (Amazon IP reputation list: 25 WCU)
  #   このグループには、Amazon脅威インテリジェンスに基づくルールが含まれます。
  #   ボットやその他の脅威に関連するソースをブロックしたい場合に便利です。
  # see: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-ip-rep.html#aws-managed-rule-groups-ip-rep-amazon
  rule {
    name     = "AWSManagedRulesAmazonIpReputationList"
    priority = 30

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      metric_name                = "${var.prefix}-AWSManagedRulesAmazonIpReputationList-metric"
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = false
    }
  }

  # AWS managed rule groups (Anonymous IP list: 50 WCU)
  #   このグループには、視聴者のIDを難読化できるサービスからのリクエストをブロックできるルールが含まれます。
  #   これには、VPN、プロキシ、Torノード、ホスティングプロバイダからのリクエストが含まれます。
  #   これは、アプリケーションから身元を隠そうとしている閲覧者をフィルタリングしたい場合に便利です。
  # see: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-ip-rep.html#aws-managed-rule-groups-ip-rep-anonymous
  rule {
    name     = "AWSManagedRulesAnonymousIpList"
    priority = 40

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAnonymousIpList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      metric_name                = "${var.prefix}-AWSManagedRulesAnonymousIpList-metric"
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = false
    }
  }

  # AWS managed rule groups (SQL database: 200 WCU)
  #   SQLインジェクション攻撃など、SQLデータベースの悪用に関連するリクエストパターンをブロックするためのルールが含まれています。
  #   これは不正なクエリのリモートインジェクションを防ぐのに役立ちます。
  # see: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-use-case.html#aws-managed-rule-groups-use-case-sql-db
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 50

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      metric_name                = "${var.prefix}-AWSManagedRulesSQLiRuleSet-metric"
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = false
    }
  }

  # AWS managed rule groups (Linux operation system: 200 WCU)
  #   LFI 攻撃を含む、Linux 固有の脆弱性の悪用に関連するリクエストパターンをブロックするルールが含まれています。
  #   これは、ファイルの内容を公開したり、攻撃者がアクセスすべきでないコードを実行したりする攻撃を防ぐのに役立ちます。
  # see: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-use-case.html#aws-managed-rule-groups-use-case-linux-os
  rule {
    name     = "AWSManagedRulesLinuxRuleSet"
    priority = 60

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesLinuxRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      metric_name                = "${var.prefix}-AWSManagedRulesLinuxRuleSet-metric"
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = false
    }
  }

  # AWS managed rule groups (POSIX operating system: 100 WCU)
  #   LFI 攻撃を含む、POSIX/POSIX-like OS 固有の脆弱性を悪用する リクエストパターンをブロックするルールが含まれています。
  #   これは、ファイルの内容を公開したり、アクセスが許可されていないはずのコードを実行したりする攻撃を防ぐのに役立ちます。
  # see: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-use-case.html#aws-managed-rule-groups-use-case-posix-os
  rule {
    name     = "AWSManagedRulesUnixRuleSet"
    priority = 70

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesUnixRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      metric_name                = "${var.prefix}-AWSManagedRulesUnixRuleSet-metric"
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = false
    }
  }
}

resource "aws_wafv2_web_acl_association" "alb" {
  resource_arn = aws_lb.main.arn
  web_acl_arn  = aws_wafv2_web_acl.alb.arn
}
