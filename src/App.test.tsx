import { render, screen } from '@testing-library/react';
import React from 'react';
import * as ReactG4 from 'react-ga4';

import App from './App';
import { constants } from './constants';

jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ToastContainer: (props: any) => <div data-testid={props['data-testid']}></div>,
}));

jest.mock('./pages', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Top: (props: any) => <div data-testid={props['data-testid']}></div>,
}));

describe('App', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const spy_initialize = jest.spyOn(ReactG4, 'initialize');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const spy_send = jest.spyOn(ReactG4, 'send');

  beforeEach(() => {
    spy_initialize.mockClear();
    spy_send.mockClear();
  });

  it('初期状態のコンポーネントが表示されること', () => {
    render(<App />);

    expect(screen.getByTestId('app__Top')).toBeVisible();
    expect(screen.getByTestId('app__ToastContainer')).toBeVisible();
  });

  it('Google Analytics 用のメソッドが呼び出されていること', () => {
    render(<App />);

    expect(spy_initialize).toBeCalledWith(process.env.REACT_APP_EMAILJS_USER_ID);
    expect(spy_send).toBeCalledWith({ hitType: 'pageview', page: constants.url.self });
  });
});
