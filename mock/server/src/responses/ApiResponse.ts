/**
 * 正常終了時のレスポンスを表します。
 * success は true が設定され、value に任意の型の値を保持します。
 */
export type ApiSuccessResponse = Readonly<{
  success: true;
  // このようなエンベロープは JSON のサイズ増加を招く割に内容的には冗長であるため賛否が分かれるが、
  // Laravel 等のフレームワークやその他著名な API でも採用されており、ここではそれに倣っておく
  // また data というキー名もクライアントが Axios であることを踏まえると微妙 (レスポンスデータへのアクセスが data.data になるため) ではあるが、
  // GraphQL の仕様ではキー名が `data` に固定されるため一応合わせておく (本 API は REST なので関係無いが)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error: never;
}>;

/**
 * 異常終了時のレスポンスを表します。
 * error にエラーの情報を保持し、それ以外の項目は存在しません。
 */
export type ApiErrorResponse = Readonly<{
  success?: false; // 基本的に success は未定義となるが false が入るケースも考慮する
  data: never; // 項目の存在自体を許容しない

  // 本プロダクトでは code に HTTP ステータスコードが格納される
  // 本来 code は API が定義するエラーの詳細を示すコードを格納する場合が多い
  // 今回は Google Sheets API の仕様を参考にしている
  //   { "error": { "code": 400, "message": "Unable to parse range: XXX", "status": "INVALID_ARGUMENT" } }
  error: {
    code: number;
    message: string;
    status: string;
  };
}>;

/**
 * Google Sheets API の正常終了時のレスポンスを再現します。
 * range, majorDimension, values に値を保持します。
 */
export type GoogleSheetsApiResponse = Readonly<{
  range: string;
  majorDimension: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any[];
}>;

/**
 * API のレスポンスを表します。
 * 正常終了時と異常終了時とで型が使い分けられます。
 */
export type ApiResponse = ApiSuccessResponse | ApiErrorResponse | GoogleSheetsApiResponse;
