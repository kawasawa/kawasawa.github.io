import { render, screen } from '@testing-library/react';
import React from 'react';
import * as ReactG4 from 'react-ga4';

import App from '@/App';
import { links } from '@/constants';

jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  ToastContainer: (props: any) => <div data-testid={props['data-testid']}></div>,
}));

jest.mock('@/pages', () => ({
  Top: (props: any) => <div data-testid={props['data-testid']}></div>,
}));

describe('App', () => {
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  /* @ts-ignore */
  const spy_initialize = jest.spyOn(ReactG4, 'initialize');
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  /* @ts-ignore */
  const spy_send = jest.spyOn(ReactG4, 'send');

  beforeEach(() => {
    spy_initialize.mockClear();
    spy_send.mockClear();
  });

  test('初期状態のコンポーネントが表示されること', () => {
    render(<App />);

    expect(screen.getByTestId('App__Top')).toBeVisible();
    expect(screen.getByTestId('App__ToastContainer')).toBeVisible();
  });

  test('Google Analytics 用のメソッドが呼び出されていること', () => {
    render(<App />);

    expect(spy_initialize).toBeCalledWith(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
    expect(spy_send).toBeCalledWith({ hitType: 'pageview', page: links.self });
  });
});
