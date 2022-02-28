import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { handleError } from '@/utils/errors';

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

describe('errors', () => {
  describe('handleError', () => {
    const spy_consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('通常の Error を受けた場合、そのメッセージが表示されること', () => {
      const error = new Error('normal error');
      handleError(error);
      expect(spy_consoleError).toBeCalledWith(error);
      expect(toast.error).toBeCalledWith('normal error');
    });

    test('AxiosError を受けた場合、そのメッセージが表示されること', () => {
      const error = new AxiosError('network error', 'ERR_NETWORK');
      handleError(error);
      expect(spy_consoleError).toBeCalledWith(error);
      expect(toast.error).toBeCalledWith('network error (ERR_NETWORK)');
    });

    test('null を受けた場合、既定のメッセージが表示されること', () => {
      const error = null;
      handleError(error);
      expect(spy_consoleError).toBeCalledWith(error);
      expect(toast.error).toBeCalledWith('unknown exception occurred.');
    });

    test('undefined を受けた場合、既定のメッセージが表示されること', () => {
      const error = undefined;
      handleError(error);
      expect(spy_consoleError).toBeCalledWith(error);
      expect(toast.error).toBeCalledWith('unknown exception occurred.');
    });

    test('JSON 化可能オブジェクトを受けた場合、JSON オブジェクトを文字列化した内容が表示されること', () => {
      const error = { message: 'object error' };
      handleError(error);
      expect(spy_consoleError).toBeCalledWith(error);
      expect(toast.error).toBeCalledWith(JSON.stringify(error));
    });

    test('JSON 化できないオブジェクトを受けた場合、オブジェクトを文字列化した内容が表示されること', () => {
      const error: any = {};
      error.self = error;
      handleError(error);
      expect(spy_consoleError).toBeCalledWith(error);
      expect(toast.error).toBeCalledWith('[object Object]');
    });
  });
});
