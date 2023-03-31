export SHELL=/bin/bash
export GO111MODULE=on

# ******************************************************************************
# docker-compose.yml 内では env_file を相対パスで指定している
# docker compose -f コマンドにて別ディレクトリから呼び出されると、相対パスの起点がずれてしまう
# 確実に env_file を充てがうため仲介するターゲットを用意し、ディレクトリを横断して呼び出す際はこれを利用する
# ******************************************************************************


# ------------------------------------------------------------------------------
# 定数定義
# ------------------------------------------------------------------------------

# カラーコード
C_RESET  := \033[m
C_RED    := \033[31m
C_GREEN  := \033[32m
C_YELLOW := \033[33m

# ログレベル
INFO  := printf "${C_GREEN}[INFO]  ${C_RESET}"  && echo -e
WARN  := printf "${C_YELLOW}[WARN]  ${C_RESET}" && echo -e
ERROR := printf "${C_RED}[ERROR] ${C_RESET}"    && echo -e


# ------------------------------------------------------------------------------
# コマンド一覧表示
# ------------------------------------------------------------------------------

.PHONY: list
list:
	@${INFO} 'select the number of the command.';\
		echo '';\
		select SELECT_VAL in $$(cat Makefile | grep -e '.PHONY:' | grep -v 'list' | sed 's!^\.PHONY\: *!!') 'CANCEL';\
		do\
			echo '';\
			if [ "$${SELECT_VAL}" = 'CANCEL' ]; then\
				${INFO} "'CANCEL' selected. abort the process...";\
				exit 0;\
			fi;\
			if [ -z $${SELECT_VAL} ]; then\
				${WARN} 'that selection does not exist. abort the process...';\
				exit 0;\
			fi;\
			echo -e ">>> make $${SELECT_VAL}${C_RESET}";\
			make --no-print-directory "$${SELECT_VAL}";\
			break;\
		done;


# ------------------------------------------------------------------------------
# コンテナ生成
# ------------------------------------------------------------------------------

.PHONY: docker-compose-up
docker-compose-up:
	@${INFO} 'docker compose up -d'
	@docker compose -p kawasawa-github-io --env-file ./server/.env up -d
	@${INFO} 'completed'


# ------------------------------------------------------------------------------
# コンテナ削除
# ------------------------------------------------------------------------------

.PHONY: docker-compose-down
docker-compose-down:
	@${INFO} 'docker compose down'
	@docker compose -p kawasawa-github-io --env-file ./server/.env down
	@${INFO} 'completed'
