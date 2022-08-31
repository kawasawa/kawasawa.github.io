import * as ReactToastify from 'react-toastify';

import { EXCEPTION_OCCURRED_MESSAGE, handleError } from './errors';

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

describe('errors', () => {
  describe('handleError', () => {
    const spy_consoleError = jest.spyOn(console, 'error');
    const spy_toastError = jest.spyOn(ReactToastify.toast, 'error');

    beforeEach(() => {
      spy_consoleError.mockClear();
      spy_toastError.mockClear();
    });

    it('メッセージを持つオブジェクトを受けた場合、そのメッセージが表示されること', async () => {
      const err = { message: 'TEST_message' };
      handleError(err);
      expect(spy_consoleError).toBeCalledWith(err);
      expect(spy_toastError).toBeCalledWith(err.message);
    });

    it('メッセージを持たないオブジェクトを受けた場合、既定のメッセージが表示されること', async () => {
      const err = {};
      handleError(err);
      expect(spy_consoleError).toBeCalledWith(err);
      expect(spy_toastError).toBeCalledWith(EXCEPTION_OCCURRED_MESSAGE);
    });

    it('null を受けた場合、既定のメッセージが表示されること', async () => {
      const err = null;
      handleError(err);
      expect(spy_consoleError).toBeCalledWith(err);
      expect(spy_toastError).toBeCalledWith(EXCEPTION_OCCURRED_MESSAGE);
    });
  });
});
