const properties = PropertiesService.getScriptProperties();

const SPREAD_SHEET_ID = properties.getProperty("SPREAD_SHEET_ID");
const SHEET_NAME_METADATA = properties.getProperty("SHEET_NAME_METADATA");
const SHEET_NAME_VERSION = properties.getProperty("SHEET_NAME_VERSION");
const QIITA_USER_ID = properties.getProperty("QIITA_USER_ID");

const ATTEMPT_INTERVAL = 5000;
const ATTEMPT_LIMIT = 5;
const BODY_LENGTH_LIMIT = 100;

function getQiitaArticles() {
  console.info("処理を開始しました。");

  // ------------------------------------------------------------
  // データのフェッチ
  // ------------------------------------------------------------

  console.info("記事をフェッチします。");
  let response = "";
  let attemptCount = 0;
  do {
    attemptCount++;
    try {
      response = UrlFetchApp.fetch(
        `https://qiita.com/api/v2/users/${QIITA_USER_ID}/items`
      );
    } catch (e) {
      if (ATTEMPT_LIMIT <= attemptCount) {
        console.error(
          "既定のリトライ回数内で Qiita の記事を取得できませんでした。処理を終了します。"
        );
        throw e;
      }
      console.warn(
        `Qiita の記事の取得に失敗しました。: attemptCount=${attemptCount}`
      );
      Utilities.sleep(ATTEMPT_INTERVAL);
    }
  } while (!response);

  // ------------------------------------------------------------
  // JSON の変換
  // ------------------------------------------------------------

  console.info("JSON を変換します。");
  const header = [
    "id",
    "title_ja-JP",
    "title_en-US",
    "body_ja-JP",
    "body_en-US",
    "tags",
    "url",
    "likes_count",
    "stocks_count",
    "comments_count",
    "created_at",
    "updated_at",
  ];
  const values = JSON.parse(response).map((article) => {
    // 本文は既定の長さで切り取る
    let body_ja = article["body"].replace(/[\r\n]+/g, " ");
    if (BODY_LENGTH_LIMIT < body_ja.length)
      body_ja = `${body_ja.slice(0, BODY_LENGTH_LIMIT)}...`;

    // (一応)レスポンスをログ出力する
    const { rendered_body, user, ...other } = article;
    console.log({ ...other, body_ja });

    // テキストを翻訳する
    const title_ja = article["title"];
    const title_en = LanguageApp.translate(title_ja, "ja", "en");
    const body_en = LanguageApp.translate(body_ja, "ja", "en");

    // タグはカンマ区切りで連結する
    const tags = article["tags"].map((tag) => tag["name"]).join(", ");

    // レコードを構築する
    return [
      article["id"],
      title_ja,
      title_en,
      body_ja,
      body_en,
      tags,
      article["url"],
      article["likes_count"],
      article["stocks_count"],
      article["comments_count"],
      article["created_at"],
      article["updated_at"],
    ];
  });

  // 作成日時の昇順に記事をソートする
  const sortColumnIndex = header.indexOf("created_at");
  values.sort((_1, _2) => (_2[sortColumnIndex] < _1[sortColumnIndex] ? 1 : -1));

  // ------------------------------------------------------------
  // Spread Sheet へ出力
  // ------------------------------------------------------------

  console.info("データを出力します。");
  const spreadSheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);

  // メタデータを保管する
  const metadataSheet = spreadSheet.getSheetByName(SHEET_NAME_METADATA);
  metadataSheet.clearContents();
  metadataSheet.appendRow(header);
  metadataSheet
    .getRange(
      metadataSheet.getLastRow() + 1,
      1,
      values.length,
      values[0].length
    )
    .setValues(values);

  // 最終更新日時を設定する
  const versionSheet = spreadSheet.getSheetByName(SHEET_NAME_VERSION);
  versionSheet.clearContents();
  versionSheet.appendRow(["last_update"]);
  versionSheet.appendRow([new Date()]);

  console.info("正常に終了しました。");
}
