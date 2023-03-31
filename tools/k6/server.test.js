import http from "k6/http";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function setup() {
  console.log("[INFO] start load test.");
}

export function teardown(data) {
  console.log("[INFO] finish load test.");
}

export function handleSummary(data) {
  if (
    !__ENV.ENABLE_REPORT ||
    String(__ENV.ENABLE_REPORT).toLowerCase() !== "true"
  )
    return;

  console.log("[INFO] output report file.");
  let path = __ENV.REPORT_PATH;
  if (!path) path = "k6-report.html";
  return { [path]: htmlReport(data) };
}

export default function () {
  let url = __ENV.REACT_APP_GOOGLEAPIS_URL;
  if (!url) url = "http://localhost:8080";
  let id = __ENV.REACT_APP_GOOGLE_SHEETS_ID;
  if (!id) id = "dummy_google_sheets_id";
  let key = __ENV.REACT_APP_GOOGLE_SHEETS_API_KEY;
  if (!key) key = "dummy_google_sheets_api_key";

  const responses = http.batch([
    ["GET", `${url}/spreadsheets/${id}/values/articles-metadata?key=${key}`],
    ["GET", `${url}/spreadsheets/${id}/values/articles-pickup?key=${key}`],
    ["GET", `${url}/spreadsheets/${id}/values/version?key=${key}`],
  ]);

  for (const response of responses) {
    check(response, {
      [`${response.request.method} ${response.request.url
        .replace(url, "")
        .replaceAll(id, "_")
        .replaceAll(key, "_")}: ステータスコードが 200 であること`]: (r) =>
        r.status === 200,
    });
  }
}
