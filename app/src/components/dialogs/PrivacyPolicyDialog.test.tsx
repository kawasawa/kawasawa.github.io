import { useMediaQuery } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { PrivacyPolicyDialog } from '@/components/dialogs/PrivacyPolicyDialog';

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}));

describe('PrivacyPolicyDialog', () => {
  const spy_consoleDebug = jest.spyOn(console, 'debug');

  beforeEach(() => {
    spy_consoleDebug.mockClear();
  });

  test('初期状態のコンポーネントが表示されること（スマートフォンサイズ）', () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);

    render(<PrivacyPolicyDialog open={true} closeAction={() => {}} />);
    expect(screen.getByTestId('PrivacyPolicyDialog__Title')).toBeVisible();
    expect(screen.getByTestId('PrivacyPolicyDialog__Close')).toBeVisible();
    expect(screen.getByTestId('PrivacyPolicyDialog__Body')).toBeVisible();
  });

  test('初期状態のコンポーネントが表示されること（PCサイズ）', () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(false);

    render(<PrivacyPolicyDialog open={true} closeAction={() => {}} />);
    expect(screen.getByTestId('PrivacyPolicyDialog__Title')).toBeVisible();
    expect(screen.getByTestId('PrivacyPolicyDialog__Close')).toBeVisible();
    expect(screen.getByTestId('PrivacyPolicyDialog__Body')).toBeVisible();
  });

  test('閉じるボタンを押下しcloseActionが呼び出されること', () => {
    const mock_closeAction = jest.fn();

    render(<PrivacyPolicyDialog open={true} closeAction={mock_closeAction} />);
    userEvent.click(screen.getByTestId('PrivacyPolicyDialog__Close'));

    expect(mock_closeAction).toBeCalled();
  });

  test('ダイアログが閉じられた状態から開かれた場合、ダイアログ内のトップ位置までスクロールされること', () => {
    const { rerender } = render(<PrivacyPolicyDialog open={false} closeAction={() => {}} />);
    rerender(<PrivacyPolicyDialog open={true} closeAction={() => {}} />);

    expect(spy_consoleDebug).toBeCalledWith('ScrollTop Completed.');
  });
});
