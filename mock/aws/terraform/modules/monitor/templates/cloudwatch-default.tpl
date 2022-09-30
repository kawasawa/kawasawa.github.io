{
  "widgets": [
    {
      "height": 5,
      "width": 6,
      "y": 0,
      "x": 0,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/ECS",
            "CPUUtilization",
            "ServiceName",
            "${ecs_service_app_name}",
            "ClusterName",
            "${ecs_cluster_main_name}",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0,
            "max": 100
          }
        },
        "legend": {
          "position": "bottom"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Average",
        "title": "[ECS] CPU使用率"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 0,
      "x": 6,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/ECS",
            "MemoryUtilization",
            "ServiceName",
            "${ecs_service_app_name}",
            "ClusterName",
            "${ecs_cluster_main_name}",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0,
            "max": 100
          }
        },
        "legend": {
          "position": "bottom"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Average",
        "title": "[ECS] メモリ使用率"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 0,
      "x": 12,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/ApplicationELB",
            "RequestCountPerTarget",
            "TargetGroup",
            "${alb_target_group_app_arn_suffix}",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0
          }
        },
        "legend": {
          "position": "bottom"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Sum",
        "title": "[ALB] リクエスト数"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 0,
      "x": 18,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/WAFV2",
            "BlockedRequests",
            "Resource",
            "${alb_arn}",
            "ResourceType",
            "ALB",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0
          }
        },
        "legend": {
          "position": "bottom"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Sum",
        "title": "[WAF] リクエスト遮断数"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 5,
      "x": 0,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/ApplicationELB",
            "HealthyHostCount",
            "TargetGroup",
            "${alb_target_group_app_arn_suffix}",
            "LoadBalancer",
            "${alb_arn_suffix}",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0
          }
        },
        "legend": {
          "position": "bottom"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Maximum",
        "title": "[ALB] ECS正常タスク数"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 5,
      "x": 6,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/ApplicationELB",
            "UnHealthyHostCount",
            "TargetGroup",
            "${alb_target_group_app_arn_suffix}",
            "LoadBalancer",
            "${alb_arn_suffix}",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0
          }
        },
        "legend": {
          "position": "bottom"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Maximum",
        "title": "[ALB] ECS異常タスク数"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 5,
      "x": 12,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/ApplicationELB",
            "TargetResponseTime",
            "LoadBalancer",
            "${alb_arn_suffix}",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0
          }
        },
        "legend": {
          "position": "hidden"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Average",
        "title": "[ALB] ターゲット応答時間"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 5,
      "x": 18,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/ApplicationELB",
            "HTTPCode_ELB_4XX_Count",
            "LoadBalancer",
            "${alb_arn_suffix}",
            {
              "region": "${region}"
            }
          ],
          [
            ".",
            "HTTPCode_ELB_5XX_Count",
            ".",
            ".",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0
          }
        },
        "legend": {
          "position": "bottom"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Sum",
        "title": "[ALB] エラー応答数"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 10,
      "x": 0,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/RDS",
            "CPUUtilization",
            "DBInstanceIdentifier",
            "${db_instance_main_identifier}",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0,
            "max": 100
          }
        },
        "legend": {
          "position": "hidden"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Average",
        "title": "[RDS] CPU使用率"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 10,
      "x": 6,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/RDS",
            "DatabaseConnections",
            "DBInstanceIdentifier",
            "${db_instance_main_identifier}",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0
          }
        },
        "legend": {
          "position": "hidden"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Maximum",
        "title": "[RDS] 接続数"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 10,
      "x": 12,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/RDS",
            "ReadLatency",
            "DBInstanceIdentifier",
            "${db_instance_main_identifier}",
            {
              "region": "${region}"
            }
          ],
          [
            "...",
            "WriteLatency",
            ".",
            "${db_instance_main_identifier}",
            {
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0
          }
        },
        "legend": {
          "position": "bottom"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Average",
        "title": "[RDS] レイテンシ"
      }
    },
    {
      "height": 5,
      "width": 6,
      "y": 10,
      "x": 18,
      "type": "metric",
      "properties": {
        "metrics": [
          [
            "AWS/RDS",
            "ReadIOPS",
            "DBInstanceIdentifier",
            "${db_instance_main_identifier}",
            {
              "period": 60,
              "region": "${region}"
            }
          ],
          [
            "...",
            "WriteIOPS",
            ".",
            "${db_instance_main_identifier}",
            {
              "period": 60,
              "region": "${region}"
            }
          ]
        ],
        "yAxis": {
          "left": {
            "min": 0
          }
        },
        "legend": {
          "position": "bottom"
        },
        "view": "timeSeries",
        "stacked": false,
        "region": "${region}",
        "period": 300,
        "stat": "Average",
        "title": "[RDS] ディスクIO"
      }
    },
    {
      "height": 5,
      "width": 24,
      "y": 15,
      "x": 0,
      "type": "log",
      "properties": {
        "query": "SOURCE '${cloudwatch_log_group_app_name}' | fields severity, @timestamp, message, userId, method, url, requestId\n| filter severity != \"TRACE\"\n| sort @timestamp desc\n| limit 100",
        "region": "${region}",
        "stacked": false,
        "title": "[Web サーバ] ログ",
        "view": "table"
      }
    }
  ]
}
