import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

/**
 * 指定されたエラーオブジェクトをコンソールに出力後、画面上にトーストで通知します。
 * @param err エラーオブジェクト
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const handleError = (err: any) => {
  console.error(err);
  const message = extractErrorMessage(err);
  toast.error(message);
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const extractErrorMessage = (err: any) => {
  if (err instanceof AxiosError) {
    const errorInfo = err.response?.data?.error;
    if (errorInfo) {
      return `${errorInfo.message} (${errorInfo.code})`;
    } else {
      return `${err.message} (${err.code})`;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  if (err === null || err === undefined) {
    return 'unknown exception occurred.';
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
};
