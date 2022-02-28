import { check } from "k6";
import http from "k6/http";

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";

/**
 * テスト開始前の処理
 */
export function setup() {
  console.log("[INFO] start load test.");

  let url = __ENV.REACT_APP_GOOGLEAPIS_URL;
  if (!url) url = "http://localhost:8080";
  let id = __ENV.REACT_APP_GOOGLE_SHEETS_ID;
  if (!id) id = "dummy_google_sheets_id";
  let key = __ENV.REACT_APP_GOOGLE_SHEETS_API_KEY;
  if (!key) key = "dummy_google_sheets_api_key";

  return { url, id, key };
}

/**
 * テストの実行
 */
export default function (data) {
  const { url, id, key } = data;

  // リクエストを送信
  const responses = http.batch([
    ["GET", `${url}/spreadsheets/${id}/values/articles-metadata?key=${key}`],
    ["GET", `${url}/spreadsheets/${id}/values/articles-pickup?key=${key}`],
    ["GET", `${url}/spreadsheets/${id}/values/version?key=${key}`],
  ]);

  // レスポンスを検証
  for (const res of responses) {
    check(res, {
      [`${res.request.method} ${res.request.url
        .replace(url, "")
        .replaceAll(id, "_")
        .replaceAll(key, "_")}: ステータスコードが 200 であること`]: (r) =>
        r.status === 200,
    });
  }
}

/**
 * テスト終了後の処理
 */
export function teardown(data) {
  console.log("[INFO] finish load test.");
}

/**
 * テスト結果のカスタマイズ
 */
export function handleSummary(data) {
  if (
    !__ENV.ENABLE_REPORT ||
    String(__ENV.ENABLE_REPORT).toLowerCase() !== "true"
  ) {
    return;
  }

  console.log("[INFO] output report file.");
  let path = __ENV.REPORT_PATH;
  if (!path) path = "k6-report.html";
  return { [path]: htmlReport(data) };
}
