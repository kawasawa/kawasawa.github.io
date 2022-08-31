import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { products } from '../models';
import { Products } from './Products';

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true, // 交差を検知した状態に固定する
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => [jest.fn()],
}));

jest.mock('./controls', () => {
  const { forwardRef } = jest.requireActual('react');
  const { Box } = jest.requireActual('@mui/material');
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ChipList: (props: any) => <div data-testid={props['data-testid']}>{props.children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ChipListItem: (props: any) => <div data-testid={props['data-testid']}></div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SectionTitle: (props: any) => <div data-testid={props['data-testid']}></div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SectionFadeIn: forwardRef(function _(props: any, ref: any) {
      return (
        <Box ref={ref} {...props}>
          {props.children}
        </Box>
      );
    }),
  };
});

describe('Products', () => {
  const original_IntersectionObserver = window.IntersectionObserver;
  const mock_IntersectionObserver = () => ({
    observe: () => jest.fn(),
    unobserve: () => jest.fn(),
    disconnect: () => jest.fn(),
  });

  beforeEach(() => {
    window.IntersectionObserver = jest.fn().mockImplementation(mock_IntersectionObserver);
  });

  afterEach(() => {
    window.IntersectionObserver = original_IntersectionObserver;
  });

  it('プロダクトが存在する場合、コンポーネントが表示されること', () => {
    render(<Products />);

    expect(screen.getByTestId('products__SectionTitle')).toBeVisible();
    products.map((product, i) => {
      expect(screen.getByTestId(`products__product${i}--name`)).toBeVisible();
      expect(screen.getByTestId(`products__product${i}--summary`)).toBeVisible();
      expect(screen.getByTestId(`products__product${i}--description`)).toBeVisible();
      expect(screen.getByTestId(`products__product${i}--codebutton`)).toBeVisible();
      expect(screen.getByTestId(`products__product${i}--pagebutton`)).toBeVisible();
      expect(screen.getByTestId(`products__product${i}--slider`)).toBeVisible();
      product.tags.map((_, j) => {
        expect(screen.getByTestId(`products__product${i}--tag${j}`)).toBeVisible();
      });
      // HACK: react-slick と MUI を組み合わせると描画の際に同じコンポーネントが複数生成される
      expect(screen.getAllByTestId(`products__product${i}--image0`).length).not.toBe(0);
    });
  });

  it('CODEボタンを押下しリポジトリのURLが読み込まれること', async () => {
    const mock_Open = jest.fn();
    window.open = mock_Open;

    render(<Products />);

    products.map(async (product, i) => {
      userEvent.click(screen.getByTestId(`products__product${i}--codebutton`));
      await waitFor(() => expect(mock_Open).toBeCalledWith(product.code, '_blank'));
    });
  });

  it('PAGEボタンを押下しアプリページのURLが読み込まれること', async () => {
    const mock_Open = jest.fn();
    window.open = mock_Open;

    render(<Products />);

    products.map(async (product, i) => {
      userEvent.click(screen.getByTestId(`products__product${i}--pagebutton`));
      await waitFor(() => expect(mock_Open).toBeCalledWith(product.page, '_blank'));
    });
  });

  it('スライダーを押下しアプリページのURLが読み込まれること', async () => {
    const mock_Open = jest.fn();
    window.open = mock_Open;

    render(<Products />);

    products.map(async (product, i) => {
      userEvent.click(screen.getByTestId(`products__product${i}--slider`));
      await waitFor(() => expect(mock_Open).toBeCalledWith(product.page, '_blank'));
    });
  });
});
