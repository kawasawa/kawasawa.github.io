import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import App from '@/App';

jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
}));

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true, // 交差を検知した状態に固定する
  }),
}));

describe('App', () => {
  test('サーバから記事情報を取得し、その情報が表示されること', async () => {
    render(<App />);
    userEvent.click(screen.getByTestId('Header__WideMenu__ARTICLES'));
    await waitFor(() => expect(screen.getByTestId(`Articles__Card0--body`)).toBeVisible());
  });
});
