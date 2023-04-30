import axios, { AxiosError, AxiosInstance, Method } from 'axios';

export const createInstance = <T>(retryLimit = 3) => {
  const client = axios.create();

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
  if (retryLimit <= 0) return client;
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // レスポンスとリトライ状況の確認
      if (retryLimit <= 0) {
        console.error(error);
        return Promise.reject(error);
      }
      retryLimit--;
      console.warn(error);
      console.warn(`retryLimit=${retryLimit}`);

      // リクエストの再試行
      const method = error.config.method;
      const url = error.config.url;
      const data = error.config.data !== undefined ? JSON.parse(error.config.data) : undefined;
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      return invoke<T>(client, method!, url!, data);
    }
  );
  return client;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const invoke = <T>(client: AxiosInstance, method: Method, url: string, data?: any) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return client.get<T>(url);
    case 'POST':
      return client.post<T>(url, data);
    case 'PATCH':
      return client.patch<T>(url, data);
    case 'DELETE':
      return client.delete<T>(url, { data });
    default:
      throw new Error(`Not implemented retry method: method=${method}`);
  }
};
