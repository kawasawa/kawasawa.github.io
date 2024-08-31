import axios, { AxiosError, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

let _client: AxiosInstance | null = null;

const createApiClient = () => {
  const client = axios.create();
  client.defaults.baseURL = process.env.REACT_APP_GOOGLEAPIS_URL;

  // CSRF トークンを送受信する
  if (process.env.NODE_ENV === 'development') {
    // ブラウザの機能で Cookie を HTTP ヘッダーの項目に含める (CSRF シークレットを送信する)
    client.defaults.withCredentials = true;
    // サーバから受け取る CSRF トークンが格納されている Cookie 名とサーバに返却する際の HTTP ヘッダー名を指定する
    // それぞれの名称はサーバ側の指定に従う
    client.defaults.xsrfCookieName = 'csrf_token';
    client.defaults.xsrfHeaderName = 'x-csrf-token';
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
