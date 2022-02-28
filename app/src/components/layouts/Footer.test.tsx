import { render, screen } from '@testing-library/react';
import React from 'react';

import { Footer } from '@/components/layouts/Footer';
import { endpoints, meta } from '@/constants';

jest.mock('@/components/elements', () => ({
  ChipList: (props: any) => <div data-testid={props['data-testid']}>{props.children}</div>,
  ChipListItem: (props: any) => <div data-testid={props['data-testid']}></div>,
}));

describe('Footer', () => {
  test('初期状態のコンポーネントが表示されること', () => {
    render(<Footer />);

    expect(screen.getByTestId('Footer__ReadMe')).toBeVisible();
    expect(screen.getByTestId('Footer__Copyright')).toBeVisible();
    expect(screen.getByTestId('Footer__Copyright')).toHaveTextContent(meta.copyright);
    expect(screen.getByTestId('Footer__Sha')).toBeVisible();
  });

  test('READMEのリンク先がリポジトリのREADMEに設定されていること', async () => {
    render(<Footer />);

    expect(screen.getByRole('link').getAttribute('href')).toBe(endpoints.readme);
  });
});
