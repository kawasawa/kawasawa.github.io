import { render, screen } from '@testing-library/react';
import React from 'react';

import { endpoints } from '@/constants';
import { Top } from '@/pages/Top';

jest.mock('@/components', () => ({
  Header: (props: any) => <div data-testid={props['data-testid']}></div>,
  Banner: (props: any) => <div data-testid={props['data-testid']}></div>,
  Products: (props: any) => <div data-testid={props['data-testid']}></div>,
  Articles: (props: any) => <div data-testid={props['data-testid']}></div>,
  About: (props: any) => <div data-testid={props['data-testid']}></div>,
  Footer: (props: any) => <div data-testid={props['data-testid']}></div>,
}));

jest.mock('@/components/controls', () => ({
  BackToTopButton: (props: any) => (
    <div data-testid={props['data-testid']} style={{ visibility: props.isVisible() ? 'visible' : 'hidden' }}></div>
  ),
}));

describe('Top', () => {
  test('初期状態のコンポーネントが表示されること', () => {
    render(<Top />);

    expect(screen.getByTestId('Top__Header')).toBeVisible();
    expect(screen.getByTestId('Top__Banner')).toBeVisible();
    expect(screen.getByTestId('Top__Products')).toBeVisible();
    expect(screen.getByTestId('Top__Articles')).toBeVisible();
    expect(screen.getByTestId('Top__About')).toBeVisible();
    expect(screen.getByTestId('Top__ReadMe')).toBeVisible();
    expect(screen.getByTestId('Top__Footer')).toBeVisible();
    expect(screen.getByTestId('Top__BackToTopButton')).not.toBeVisible();
  });

  test('指定の位置までスクロールしトップへ戻るボタンが表示されること', () => {
    const { rerender } = render(<Top />);
    window.scrollY = 1;
    rerender(<Top />);

    expect(screen.getByTestId('Top__BackToTopButton')).toBeVisible();
  });

  test('READMEのリンク先がリポジトリのREADMEに設定されていること', async () => {
    render(<Top />);

    expect(screen.getByRole('link').getAttribute('href')).toBe(endpoints.readme);
  });
});
