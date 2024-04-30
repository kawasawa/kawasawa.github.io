import axios, { AxiosError, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

let _client: AxiosInstance | null = null;

const createApiClient = () => {
  const client = axios.create();
  client.defaults.baseURL = process.env.REACT_APP_GOOGLEAPIS_URL;

  // CSRF トークンを送受信する
  if (process.env.NODE_ENV === 'development') {
    // Cookie を含めて送信する
    client.defaults.withCredentials = true;

    // CSRF トークンを Cookie 経由で受信する場合の設定
    //
    // Axios 1.6.2 以降で CSRF トークンを送信する場合は withCredentials に加え withXSRFToken も指定する
    //   see: https://github.com/axios/axios/blob/v1.x/CHANGELOG.md#162-2023-11-14
    //   1.6.2 (2023-11-14)
    //   "withXSRFToken: added withXSRFToken option as a workaround to achieve the old withCredentials behavior"
    // client.defaults.withXSRFToken = true;
    // レスポンス内の CSRF トークンが格納された Cookie 名と、リクエストに含める際の HTTP ヘッダー名を指定する (名称はサーバ側の指定に従う)
    // client.defaults.xsrfCookieName = 'csrf_token';
    // client.defaults.xsrfHeaderName = 'x-csrf-token';
  }

  // リクエストの送受信時にログ出力する
  if (process.env.NODE_ENV === 'development') {
    client.interceptors.request.use((config) => {
      console.debug(`request sent.: %o`, config);
      return config;
    });
    client.interceptors.response.use((response) => {
      console.debug(`response received.: %o`, response);
      return response;
    });
  }

  // リトライを制御する
  axiosRetry(client, {
    // リトライ回数
    retries: 3,
    // 指数バックオフ方式
    retryDelay: axiosRetry.exponentialDelay,
    // リトライ時のログ出力
    onRetry: (count: number, error: AxiosError) => console.warn(`axios retried: retryCount=${count}, error=%o`, error),
    onMaxRetryTimesExceeded: (error: AxiosError) => console.error(`axios failed: error=%o`, error),
  });
  return client;
};

/**
 * API クライアントのインスタンスを取得します。
 * @returns API クライアント
 */
export const getApiClient = () => _client ?? (_client = createApiClient());
