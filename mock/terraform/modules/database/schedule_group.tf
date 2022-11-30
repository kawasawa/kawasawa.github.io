# ------------------------------------------------------------------------------
# 電源管理スケジュールグループ
# ------------------------------------------------------------------------------

resource "aws_scheduler_schedule_group" "power_save" {
  name = "${var.prefix}-schedule-group-power-save"
  tags = { Name = "${var.prefix}-schedule-group-power-save" }
}
