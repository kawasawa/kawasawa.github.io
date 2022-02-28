#!/bin/sh

# 必須の変数をチェック
if [ -z "$INIT_FLAG" ] \
  || [ -z "$SONAR_QUBE_HOST" ] \
  || [ -z "$SONAR_QUBE_PORT" ] \
  || [ -z "$PROJECT_NAME" ] \
  || [ -z "$PROJECT_KEY" ]; then
  echo "[ERROR] INIT_FLAG, SONAR_QUBE_HOST, SONAR_QUBE_PORT, PROJECT_NAME, PROJECT_KEY is required."
  exit 1
fi

# 初期化済みであれば終了
if [ -f "$INIT_FLAG" ]; then
  echo "[INFO] Already initialized. Skipping..."
  exit 0
fi

# SonarQube が受付可能な状態になるまで待機
echo "[INFO] Waiting for SonarQube to become ready..."
MAX_RETRIES=30
WAIT_TIME=3
COUNT=0
while true; do
  # ヘルスチェックに成功した場合は break
  HEALTH_RESPONSE=$(curl -s -u admin:admin http://$SONAR_QUBE_HOST:$SONAR_QUBE_PORT/api/system/health 2>/dev/null)
  if echo "$HEALTH_RESPONSE" | grep -q '"health":"GREEN"'; then
    echo "[INFO] SonarQube is ready!"
    break
  fi

  # 指定の回数失敗した場合は終了
  COUNT=$((COUNT + 1))
  if [ "$COUNT" -ge "$MAX_RETRIES" ]; then
    echo "[ERROR] Timed out waiting for SonarQube to become ready after ${MAX_RETRIES} attempts."
    exit 1
  fi

  # ヘルスチェックをリトライ
  echo "  $COUNT/$MAX_RETRIES: SonarQube not ready yet. Retrying in ${WAIT_TIME} seconds..."
  sleep ${WAIT_TIME}
done

# 新しいパスワードを生成
echo "[INFO] Generating new password..."
generate_password() {
  # 英大文字、英小文字、数字、記号を含む文字列を出力
  upper=$(tr -dc 'A-Z' < /dev/urandom | head -c 3)
  lower=$(tr -dc 'a-z' < /dev/urandom | head -c 3)
  digit=$(tr -dc '0-9' < /dev/urandom | head -c 3)
  symbol=$(tr -dc '!@#$%&()_=+' < /dev/urandom | head -c 3) # ^*-はややこしいので除外
  echo "${upper}${lower}${digit}${symbol}"
}
ADMIN_PASSWORD=$(generate_password)

# admin のパスワードを変更
echo "[INFO] Changing admin password..."
curl -s -u admin:admin -X POST "http://$SONAR_QUBE_HOST:$SONAR_QUBE_PORT/api/users/change_password" \
  --data-urlencode "login=admin" \
  --data-urlencode "previousPassword=admin" \
  --data-urlencode "password=${ADMIN_PASSWORD}"

# プロジェクトを作成
echo "[INFO] Creating project: $PROJECT_NAME ($PROJECT_KEY)..."
PROJECT=$(curl -s -u admin:$ADMIN_PASSWORD -X POST "http://$SONAR_QUBE_HOST:$SONAR_QUBE_PORT/api/projects/create" \
  -d "name=$PROJECT_NAME"  \
  -d "project=$PROJECT_KEY")

# トークンを発行
echo "[INFO] Generating token for project..."
TOKEN=$(curl -s -u admin:$ADMIN_PASSWORD -X POST "http://$SONAR_QUBE_HOST:$SONAR_QUBE_PORT/api/user_tokens/generate" \
  -d "name=${PROJECT_KEY}-token")
PROJECT_TOKEN=$(echo "$TOKEN" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

# 初期化情報を出力
echo "[INFO] Writing init info to $INIT_FLAG..."
echo "# SonarQube の初期化処理が完了しました。" > "$INIT_FLAG"
echo "PROJECT=$PROJECT" >> "$INIT_FLAG"
echo "TOKEN=$TOKEN" >> "$INIT_FLAG"
echo "" >> "$INIT_FLAG"
echo "# ワークスペース直下で下記コマンドを実行し、脆弱性スキャンを開始してください。" >> "$INIT_FLAG"
echo "\`\`\`" >> "$INIT_FLAG"
echo "npm install -g @sonar/scan" >> "$INIT_FLAG"
echo "sonar \\" >> "$INIT_FLAG"
echo "  -Dsonar.host.url=http://localhost:$SONAR_QUBE_PORT \\" >> "$INIT_FLAG"
echo "  -Dsonar.token=$PROJECT_TOKEN \\" >> "$INIT_FLAG"
echo "  -Dsonar.projectKey=$PROJECT_KEY" >> "$INIT_FLAG"
echo "\`\`\`" >> "$INIT_FLAG"
echo "" >> "$INIT_FLAG"
echo "# 脆弱性スキャンの完了後、 http://localhost:$SONAR_QUBE_PORT にログインし結果レポートをご確認ください。" >> "$INIT_FLAG"
echo "USER=admin" >> "$INIT_FLAG"
echo "PASSWORD=$ADMIN_PASSWORD" >> "$INIT_FLAG"

echo "[INFO] Initialization complete."
