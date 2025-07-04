# Generated by GitHub Copilot

import logging
import sys
from datetime import datetime
from pathlib import Path


def createMcpLogger(
    logLevel: str = "INFO",
    includeFileOutput: bool = True,
) -> logging.Logger:
    """
    MCP用ロガーを作成する関数
    Args:
        logLevel (str): ログレベル
        includeFileOutput (bool): ファイル出力も行うかどうか
    Returns:
        logging.Logger: 設定済みロガー
    """
    logger = logging.getLogger()
    logger.handlers.clear()
    logger.setLevel(getattr(logging, logLevel.upper()))
    format = "[%(levelname)s] %(name)s:%(lineno)d - %(message)s"

    # 標準エラー出力ハンドラー
    stderrFormatter = logging.Formatter(format)
    stderrHandler = logging.StreamHandler(sys.stderr)
    stderrHandler.setFormatter(stderrFormatter)
    logger.addHandler(stderrHandler)

    # ファイル出力ハンドラー
    if includeFileOutput:
        now = datetime.now().strftime("%Y%m%d")
        filename = Path("logs") / f"{now}.log"
        filename.parent.mkdir(exist_ok=True)

        fileFormatter = logging.Formatter(f"%(asctime)s {format}")
        fileHandler = logging.FileHandler(filename, encoding="utf-8")
        fileHandler.setFormatter(fileFormatter)
        logger.addHandler(fileHandler)

    logger.propagate = False
    return logger


# グローバルロガーインスタンス
mcp_logger = createMcpLogger("DEBUG")
