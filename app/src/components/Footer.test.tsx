import { render, screen } from '@testing-library/react';
import React from 'react';

import { Footer } from '@/components/Footer';
import { meta } from '@/constants';

jest.mock('@/components/controls', () => ({
  ChipList: (props: any) => <div data-testid={props['data-testid']}>{props.children}</div>,
  ChipListItem: (props: any) => <div data-testid={props['data-testid']}></div>,
}));

describe('Footer', () => {
  test('初期状態のコンポーネントが表示されること', () => {
    render(<Footer />);

    expect(screen.getByTestId('Footer__Tags__GitHub')).toBeVisible();
    expect(screen.getByTestId('Footer__Tags__Codecov')).toBeVisible();
    expect(screen.getByTestId('Footer__Copyright')).toBeVisible();
    expect(screen.getByTestId('Footer__Copyright')).toHaveTextContent(meta.copyright);
  });
});
