import { toast } from 'react-toastify';

export const EXCEPTION_OCCURRED_MESSAGE = 'exception occurred.';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const handleError = (e: any) => {
  console.error(e);
  toast.error(e?.message ?? EXCEPTION_OCCURRED_MESSAGE);
};
