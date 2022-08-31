import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { BackToTopButton } from './BackToTopButton';

jest.mock('./SectionFadeIn', () => {
  const { forwardRef } = jest.requireActual('react');
  const { Box } = jest.requireActual('@mui/material');
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SectionFadeIn: forwardRef(function _(props: any, ref: any) {
      return (
        <Box ref={ref} {...props} data-testid="mock__Fade">
          {props.children}
        </Box>
      );
    }),
  };
});

describe('BackToTopButton', () => {
  const spy_addEventListener = jest.spyOn(window, 'addEventListener');

  beforeEach(() => {
    spy_addEventListener.mockClear();
  });

  it('プロパティが授受されていること', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mock_eventListeners: { [key: string]: any[] } = {};
    spy_addEventListener.mockImplementation((type, listener) => {
      mock_eventListeners[type] ??= [];
      mock_eventListeners[type].push(listener);
    });
    const isVisible = jest.fn(() => true);

    render(<BackToTopButton isVisible={isVisible} />);
    act(() => mock_eventListeners.scroll.forEach((listener) => listener()));

    expect(screen.getByTestId('mock__Fade')).toBeVisible();
  });

  it('ボタンを押下しページトップ位置までスクロールされること', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mock_eventListeners: { [key: string]: any[] } = {};
    spy_addEventListener.mockImplementation((type, listener) => {
      mock_eventListeners[type] ??= [];
      mock_eventListeners[type].push(listener);
    });
    const isVisible = jest.fn(() => true);

    render(<BackToTopButton isVisible={isVisible} />);
    act(() => mock_eventListeners.scroll.forEach((listener) => listener()));

    window.scrollY = 100;
    userEvent.click(screen.getByTestId('mock__Fade'));
    await waitFor(() => expect(window.screenY).toBe(0));
  });
});
