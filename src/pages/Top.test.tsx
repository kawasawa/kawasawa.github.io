import { render, screen } from '@testing-library/react';
import React from 'react';

import { Top } from './Top';

jest.mock('../components', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Header: (props: any) => <div data-testid={props['data-testid']}></div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Banner: (props: any) => <div data-testid={props['data-testid']}></div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Products: (props: any) => <div data-testid={props['data-testid']}></div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Articles: (props: any) => <div data-testid={props['data-testid']}></div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  About: (props: any) => <div data-testid={props['data-testid']}></div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Footer: (props: any) => <div data-testid={props['data-testid']}></div>,
}));

jest.mock('../components/controls', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  BackToTopButton: (props: any) => (
    <div data-testid={props['data-testid']} style={{ visibility: props.isVisible() ? 'visible' : 'hidden' }}></div>
  ),
}));

describe('Top', () => {
  it('初期状態のコンポーネントが表示されること', () => {
    render(<Top />);

    expect(screen.getByTestId('top__Header')).toBeVisible();
    expect(screen.getByTestId('top__Banner')).toBeVisible();
    expect(screen.getByTestId('top__Products')).toBeVisible();
    expect(screen.getByTestId('top__Articles')).toBeVisible();
    expect(screen.getByTestId('top__About')).toBeVisible();
    expect(screen.getByTestId('top__Footer')).toBeVisible();
    expect(screen.getByTestId('top__BackToTopButton')).not.toBeVisible();
  });

  it('指定の位置までスクロールしトップへ戻るボタンが表示されること', () => {
    const { rerender } = render(<Top />);
    window.scrollY = 1;
    rerender(<Top />);

    expect(screen.getByTestId('top__BackToTopButton')).toBeVisible();
  });
});
