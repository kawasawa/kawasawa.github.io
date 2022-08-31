import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';

describe('PrivacyPolicyDialog', () => {
  const spy_consoleDebug = jest.spyOn(console, 'debug');

  beforeEach(() => {
    spy_consoleDebug.mockClear();
  });

  it('初期状態のコンポーネントが表示されること', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(<PrivacyPolicyDialog open={true} closeAction={() => {}} />);
    expect(screen.getByTestId('privacyPolicyDialog__title')).toBeVisible();
    expect(screen.getByTestId('privacyPolicyDialog__closeButton')).toBeVisible();
    expect(screen.getByTestId('privacyPolicyDialog__body')).toBeVisible();
  });

  it('閉じるボタンを押下しcloseActionが呼び出されること', () => {
    const mock_closeAction = jest.fn();

    render(<PrivacyPolicyDialog open={true} closeAction={mock_closeAction} />);
    userEvent.click(screen.getByTestId('privacyPolicyDialog__closeButton'));

    expect(mock_closeAction).toBeCalled();
  });

  it('ダイアログが閉じられた状態から開かれた場合、useEffect（ページトップ位置までスクロールされる処理）が呼び出されること', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const { rerender } = render(<PrivacyPolicyDialog open={false} closeAction={() => {}} />);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    rerender(<PrivacyPolicyDialog open={true} closeAction={() => {}} />);

    expect(spy_consoleDebug).toBeCalled();
  });
});
