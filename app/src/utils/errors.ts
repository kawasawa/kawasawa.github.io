import { toast } from 'react-toastify';

/**
 * 指定されたエラーオブジェクトをコンソールに出力後、画面上にトーストで通知します。
 * @param e エラーオブジェクト
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const handleError = (e: any) => {
  console.error(e);
  toast.error(e?.message ?? 'exception occurred.');
};
