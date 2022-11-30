[
    {
        "name" : "${container_name}",
        "image" : "${container_image}",
        "portMappings" : [
            {
                "containerPort" : ${container_port},
                "hostPort" : ${container_port}
            }
        ],
        "environment": [
            {
                "name" : "DATABASE_URL",
                "value" : "mysql://${db_username}:${db_password}@${db_address}:${db_port}/${db_name}"
            }
        ],
        "logConfiguration" : {
            "logDriver" : "awslogs",
            "options" : {
                "awslogs-group" : "${log_group}",
                "awslogs-region" : "${region}",
                "awslogs-stream-prefix" : "${container_name}"
            }
        }
    }
]
