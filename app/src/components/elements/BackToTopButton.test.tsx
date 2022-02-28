import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { BackToTopButton } from '@/components/elements/BackToTopButton';
import * as Element from '@/utils/elements';

jest.mock('@/utils/elements', () => ({
  scrollToTop: jest.fn(),
}));

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

describe('BackToTopButton', () => {
  const spy_addEventListener = jest.spyOn(window, 'addEventListener');
  const spy_scrollToTop = jest.spyOn(Element, 'scrollToTop');

  beforeEach(() => {
    spy_addEventListener.mockClear();
    spy_scrollToTop.mockClear();
  });

  test('プロパティが授受されていること', () => {
    const isVisible = jest.fn(() => true);
    render(<BackToTopButton isVisible={isVisible} />);

    expect(screen.getByTestId('mock__Fade')).toBeVisible();
  });

  test('ボタンを押下しページトップ位置までスクロールされること', async () => {
    const mock_eventListeners: { [key: string]: any[] } = {};
    spy_addEventListener.mockImplementation((type, listener) => {
      mock_eventListeners[type] ??= [];
      mock_eventListeners[type].push(listener);
    });
    const isVisible = jest.fn(() => true);

    render(<BackToTopButton isVisible={isVisible} />);
    act(() => mock_eventListeners.scroll.forEach((listener) => listener()));

    window.scrollY = 100;
    userEvent.click(screen.getByTestId('BackToTopButton__Fab'));
    expect(spy_scrollToTop).toBeCalled();
    await waitFor(() => expect(window.screenY).toBe(0));
  });
});
