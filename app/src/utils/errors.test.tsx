import * as ReactToastify from 'react-toastify';

import { handleError } from '@/utils/errors';

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

describe('error', () => {
  describe('handleError', () => {
    const spy_consoleError = jest.spyOn(console, 'error');
    const spy_toastError = jest.spyOn(ReactToastify.toast, 'error');

    beforeEach(() => {
      spy_consoleError.mockClear();
      spy_toastError.mockClear();
    });

    test('メッセージを持つオブジェクトを受けた場合、そのメッセージが表示されること', async () => {
      const error = { message: 'TEST_message' };
      handleError(error);
      expect(spy_consoleError).toBeCalledWith(error);
      expect(spy_toastError).toBeCalledWith(error.message);
    });

    test('メッセージを持たないオブジェクトを受けた場合、既定のメッセージが表示されること', async () => {
      const error = {};
      handleError(error);
      expect(spy_consoleError).toBeCalledWith(error);
      expect(spy_toastError).toBeCalledWith('exception occurred.');
    });

    test('null を受けた場合、既定のメッセージが表示されること', async () => {
      const error = null;
      handleError(error);
      expect(spy_consoleError).toBeCalledWith(error);
      expect(spy_toastError).toBeCalledWith('exception occurred.');
    });
  });
});
