import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Products } from '@/components/layouts/Products';
import { values } from '@/constants';
import { products } from '@/entities';

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true, // 交差を検知した状態に固定する
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => [jest.fn()],
}));

jest.mock('swiper/modules', () => ({
  Autoplay: {},
  Pagination: {},
}));

jest.mock('swiper/react', () => ({
  Swiper: (props: any) => <div data-testid={props['data-testid']}>{props.children}</div>,
  SwiperSlide: (props: any) => <div data-testid={props['data-testid']}>{props.children}</div>,
}));

jest.mock('@/components/elements', () => {
  const { forwardRef } = jest.requireActual('react');
  return {
    ChipList: (props: any) => <div data-testid={props['data-testid']}>{props.children}</div>,
    ChipListItem: (props: any) => <div data-testid={props['data-testid']}></div>,
    SectionTitle: (props: any) => <div data-testid={props['data-testid']}></div>,
    SectionFadeIn: forwardRef((props: any, ref: any) => (
      <div ref={ref} {...props}>
        {props.children}
      </div>
    )),
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

  test('プロダクトが存在する場合、コンポーネントが表示されること', () => {
    render(<Products />);

    expect(screen.getByTestId('Products__SectionTitle')).toBeVisible();
    products.slice(0, values.PRODUCTS_ALWAYS_DISPLAY_COUNT).map((product, i) => {
      expect(screen.getByTestId(`Products__Product${i}__Name`)).toBeVisible();
      expect(screen.getByTestId(`Products__Product${i}__Summary`)).toBeVisible();
      expect(screen.getByTestId(`Products__Product${i}__Description`)).toBeVisible();
      expect(screen.getByTestId(`Products__Product${i}__Code`)).toBeVisible();
      expect(screen.getByTestId(`Products__Product${i}__Page`)).toBeVisible();
      product.tags.map((_, j) => {
        expect(screen.getByTestId(`Products__Product${i}__Tag${j}`)).toBeVisible();
      });

      expect(screen.getByTestId(`Products__Product${i}__Slider`)).toBeVisible();
      expect(screen.getByTestId(`Products__Product${i}__Image0`)).toBeVisible();
    });

    expect(screen.getByTestId('Products__Accordion')).toBeVisible();
    products.slice(values.PRODUCTS_ALWAYS_DISPLAY_COUNT).map((product, index) => {
      const i = index + values.PRODUCTS_ALWAYS_DISPLAY_COUNT;
      expect(screen.getByTestId(`Products__Product${i}__Name`)).toBeDefined();
      expect(screen.getByTestId(`Products__Product${i}__Summary`)).toBeDefined();
      expect(screen.getByTestId(`Products__Product${i}__Description`)).toBeDefined();
      expect(screen.getByTestId(`Products__Product${i}__Code`)).toBeDefined();
      expect(screen.getByTestId(`Products__Product${i}__Page`)).toBeDefined();
      product.tags.map((_, j) => {
        expect(screen.getByTestId(`Products__Product${i}__Tag${j}`)).toBeDefined();
      });

      expect(screen.queryByTestId(`Products__Product${i}__Slider`)).toBeNull();
      expect(screen.queryByTestId(`Products__Product${i}__Image0`)).toBeNull();
    });
  });

  test('アコーディオンを押下し、非違表示のコンポーネントが表示されること', () => {
    render(<Products />);

    userEvent.click(screen.getByTestId(`Products__Accordion`));
    products.slice(values.PRODUCTS_ALWAYS_DISPLAY_COUNT).map(async (product, index) => {
      const i = index + values.PRODUCTS_ALWAYS_DISPLAY_COUNT;
      await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Name`)).toBeVisible());
      await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Summary`)).toBeVisible());
      await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Description`)).toBeVisible());
      await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Code`)).toBeVisible());
      await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Page`)).toBeVisible());
      await Promise.all(
        product.tags.map(async (_, j) => {
          await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Tag${j}`)).toBeVisible());
        })
      );
    });
  });

  test('プロダクト名のリンク先がプロダクトのURLに設定されていること', async () => {
    render(<Products />);

    screen.getAllByRole('link').map((element, i) => {
      expect(element.getAttribute('href')).toBe(products[i].page);
    });
  });

  test('CODEボタンを押下しリポジトリのURLが読み込まれること', async () => {
    const mock_Open = jest.fn();
    window.open = mock_Open;

    render(<Products />);

    await Promise.all(
      products.map(async (product, i) => {
        userEvent.click(screen.getByTestId(`Products__Product${i}__Code`));
        await waitFor(() => expect(mock_Open).toBeCalledWith(products[i].code, '_blank'));
      })
    );
  });

  test('PAGEボタンを押下しプロダクトのURLが読み込まれること', async () => {
    const mock_Open = jest.fn();
    window.open = mock_Open;

    render(<Products />);

    await Promise.all(
      products.map(async (product, i) => {
        userEvent.click(screen.getByTestId(`Products__Product${i}__Page`));
        await waitFor(() => expect(mock_Open).toBeCalledWith(product.page, '_blank'));
      })
    );
  });
});
