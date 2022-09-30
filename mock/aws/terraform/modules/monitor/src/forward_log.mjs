import https from "https";
import zlib from "zlib";

/**
 * エントリーポイント
 * @param event イベント情報
 */
export const handler = async (event) => {
  try {
    console.log(`event: ${JSON.stringify(event)}`);

    const environment = process.env["ENVIRONMENT"];
    let title = "";
    let message = "";
    let detail = "";

    // ログ起点の場合
    if (!!event.awslogs) {
      title = `ログ監視アラート (${environment})`;
      message = `AP サーバからエラーログが出力されました。\nアプリケーション内部の処理、または対向システムとの通信で不具合が発生した可能性があります。\n添付のログを確認し、\n- \`method\` および \`url\` から API を特定\n- \`stack\` からソースコードを特定\nし、一次対応を実施してください。\n※ 血止めを最優先とし、原因分析と本対応は後日実施してください`;
      detail = JSON.parse(
        zlib
          .gunzipSync(Buffer.from(event.awslogs.data, "base64"))
          .toString("utf8")
      )
        .logEvents.map((e) => {
          try {
            // メッセージはエスケープされたJSON文字列であるため、
            // 一度JSONオブジェクトとして読み直し、再度文字列に変換することでクレンジングする
            return `\`\`\`${JSON.stringify(
              JSON.parse(e.message),
              null,
              "  "
            )}\`\`\``;
          } catch {
            return "";
          }
        })
        .join("\n");
    }
    // アラーム起点の場合
    else if (!!event.alarmData) {
      title = `死活監視アラート (${environment})`;
      message = `一部の ECS コンテナが正常に応答していません。\nサーバがビジー状態、またはアプリケーションの不具合の可能性があります。\n必要に応じて、手動での水平スケーリング（タスク数の一時的な増加など）をご検討ください。\n※ Terraform 管理下のため、原因分析と本対応は後日実施してください`;
      try {
        detail += `reason\n\`\`\`${event.alarmData.state?.reason}\`\`\`\n`;
      } catch {}
      try {
        detail += `reasonData\n\`\`\`${JSON.stringify(
          JSON.parse(event.alarmData.state?.reasonData),
          null,
          "  "
        )}\`\`\`\n`;
      } catch {}
      try {
        detail += `metrics\n\`\`\`${event.alarmData.configuration?.metrics
          ?.map((m) => JSON.stringify(m, null, "  "))
          .join("\n")}\`\`\`\n`;
      } catch {}
      detail = detail.trimEnd("\n");
    }
    // 上記のいずれも該当しない場合
    else {
      title = `不明なアラート (${environment})`;
      message = `予期されていないアラートを検知しました。\n詳細は添付のイベント情報をご確認ください。`;
      detail = `\`\`\`${JSON.stringify(event)}\`\`\``;
    }

    const payload = { text: `*${title}*\n${message}\n---\n${detail}` };
    console.log(`request: ${JSON.stringify(payload)}`);
    const res = await postRequest(payload);
    console.log(`response: ${res}`);
  } catch (e) {
    console.error(`exception has occurred: ${e}`);
  }
};

/**
 * リクエストを送信します。
 * @param payload ペイロード
 * @returns 非同期タスク
 */
const postRequest = (payload) =>
  new Promise((resolve, reject) => {
    const destination = process.env["ALERT_WEBHOOK_URL"];
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const req = https.request(destination, options, (res) => {
      resolve(`${res.statusCode}: ${res.statusMessage}`);
    });
    req.on("error", (e) => {
      reject(e.message);
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
