import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import usePwa from 'use-pwa';

import { AUTO_HIDE_DURATION, Installer } from './Installer';

jest.mock('use-pwa');
jest.mock('@/components/elements/SectionFadeIn', () => {
  const { forwardRef } = jest.requireActual('react');
  return {
    SectionFadeIn: forwardRef((props: any, ref: any) => (
      <div ref={ref} {...props} data-testid="mock__Fade">
        {props.children}
      </div>
    )),
  };
});

describe('Installer', () => {
  const mockUsePwa = usePwa as jest.Mock;

  beforeEach(() => {
    mockUsePwa.mockReturnValue({
      isPwa: false,
      enabledPwa: true,
      showInstallPrompt: jest.fn(),
    });
  });

  test('インストールボタンが表示されること', () => {
    render(<Installer />);
    expect(screen.getByTestId('Installer__Fab')).toBeVisible();
  });

  test('インストールプロンプトが表示されること', () => {
    const mock_showInstallPrompt = jest.fn();
    mockUsePwa.mockReturnValueOnce({
      isPwa: false,
      enabledPwa: true,
      canInstallprompt: true,
      showInstallPrompt: mock_showInstallPrompt,
    });
    render(<Installer />);
    userEvent.click(screen.getByTestId('Installer__Fab'));
    expect(mock_showInstallPrompt).toBeCalled();
  });

  test('インストール可能な状態になるまではインストールボタンが無効化されること', () => {
    mockUsePwa.mockReturnValueOnce({
      isPwa: false,
      enabledPwa: true,
      canInstallprompt: false,
      showInstallPrompt: jest.fn(),
    });
    render(<Installer />);
    expect(screen.getByTestId('Installer__Fab')).toBeDisabled();
  });

  test('PWA モードで起動された場合、インストールボタンが表示されないこと', () => {
    mockUsePwa.mockReturnValueOnce({
      isPwa: true,
      enabledPwa: true,
      showInstallPrompt: jest.fn(),
    });
    render(<Installer />);
    expect(screen.queryByTestId('Installer__Fab')).not.toBeInTheDocument();
  });

  test('代替メッセージが表示されること', async () => {
    mockUsePwa.mockReturnValueOnce({
      isPwa: false,
      enabledPwa: false,
      showInstallPrompt: jest.fn(),
    });
    render(<Installer />);
    userEvent.click(screen.getByTestId('Installer__Fab'));
    expect(screen.getByTestId('Installer__Snackbar')).toBeVisible();
    await waitFor(() => expect(screen.queryByTestId('Installer__Snackbar')).not.toBeInTheDocument(), {
      timeout: AUTO_HIDE_DURATION + 1000,
    });
  });

  test('代替メッセージがキャンセルされること', async () => {
    mockUsePwa.mockReturnValueOnce({
      isPwa: false,
      enabledPwa: false,
      showInstallPrompt: jest.fn(),
    });
    render(<Installer />);
    userEvent.click(screen.getByTestId('Installer__Fab'));
    userEvent.click(screen.getByText('installer__cancel'));
    await waitFor(() => expect(screen.queryByTestId('Installer__Snackbar')).not.toBeInTheDocument());
  });

  test('代替メッセージが自動的に非表示になること', async () => {
    jest.useFakeTimers();
    mockUsePwa.mockReturnValueOnce({
      isPwa: false,
      enabledPwa: false,
      showInstallPrompt: jest.fn(),
    });
    render(<Installer />);
    userEvent.click(screen.getByTestId('Installer__Fab'));
    jest.advanceTimersByTime(AUTO_HIDE_DURATION);
    await waitFor(() => expect(screen.queryByTestId('Installer__Snackbar')).not.toBeInTheDocument());
    jest.useRealTimers();
  });
});
