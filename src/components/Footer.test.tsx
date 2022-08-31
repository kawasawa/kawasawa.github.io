import { render, screen } from '@testing-library/react';
import React from 'react';

import { constants } from '../constants';
import { Footer } from './Footer';

jest.mock('./controls', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ChipList: (props: any) => <div data-testid={props['data-testid']}>{props.children}</div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ChipListItem: (props: any) => <div data-testid={props['data-testid']}></div>,
}));

describe('Footer', () => {
  it('初期状態のコンポーネントが表示されること', () => {
    render(<Footer />);

    expect(screen.getByTestId('footer__copyright')).toBeVisible();
    expect(screen.getByTestId('footer__copyright')).toHaveTextContent(constants.meta.copyright);
    expect(screen.getByTestId('footer__tags')).toBeVisible();
    expect(screen.getByTestId('footer__tags--coverage')).toBeVisible();
    expect(screen.getByTestId('footer__tags--license')).toBeVisible();
  });
});
