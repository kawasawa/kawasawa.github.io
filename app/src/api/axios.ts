import axios, { AxiosError, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

let _client: AxiosInstance | null = null;

const createApiClient = () => {
  const client = axios.create();
  // 指定回数のリトライを指数バックオフ方式で実施する
  axiosRetry(client, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    onRetry: (count: number, error: AxiosError) => console.warn(`axios retried: retryCount=${count}, error=${error}`),
    onMaxRetryTimesExceeded: (error: AxiosError) => console.error(`axios failed: error=${error}`),
  });
  return client;
};

/**
 * API クライアントのインスタンスを取得します。
 * @returns API クライアント
 */
export const getApiClient = () => _client ?? (_client = createApiClient());
