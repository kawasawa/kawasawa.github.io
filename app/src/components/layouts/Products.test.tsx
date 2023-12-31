import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Products } from '@/components/layouts/Products';
import { values } from '@/constants';
import * as Hooks from '@/hooks';

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true, // 交差を検知した状態に固定する
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => [jest.fn(), { language: 'ja-JP' }],
}));

jest.mock('@/hooks', () => ({
  useProducts: jest.fn(),
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

const dummy_products_onlyPickup = [
  {
    id: 1,
    'title_ja-JP': 'タイトル1',
    'title_en-US': 'title1',
    'subject_ja-JP': 'サブジェクト1',
    'subject_en-US': 'subject1',
    'body_ja-JP': 'ボディ1',
    'body_en-US': 'body1',
    skills: [
      { key: 'icon1', icon: 'data1' },
      { key: 'icon2', icon: 'data2' },
    ],
    url_code: 'https://example.com/product_1/code',
    url_home: 'https://example.com/product_1/home',
    downloads: 1,
    pickup: true,
    visible: true,
    images: [
      {
        rowNo: 1,
        data: 'product1_image1',
      },
      {
        rowNo: 2,
        data: 'product1_image2',
      },
    ],
  },
  {
    id: 2,
    'title_ja-JP': 'タイトル2',
    'title_en-US': 'title2',
    'subject_ja-JP': 'サブジェクト2',
    'subject_en-US': 'subject2',
    'body_ja-JP': 'ボディ2',
    'body_en-US': 'body2',
    skills: [{ key: 'icon2', icon: 'data2' }],
    url_code: 'https://example.com/product_2/code',
    url_home: 'https://example.com/product_2/home',
    downloads: null,
    pickup: true,
    visible: true,
    images: [],
  },
];

const dummy_products_onlyNotPickup = [
  {
    id: 3,
    'title_ja-JP': 'タイトル3',
    'title_en-US': 'title3',
    'subject_ja-JP': 'サブジェクト3',
    'subject_en-US': 'subject3',
    'body_ja-JP': 'ボディ3',
    'body_en-US': 'body3',
    skills: [{ key: 'icon3', icon: '' }],
    url_code: 'https://example.com/product_3/code',
    url_home: 'https://example.com/product_3/home',
    downloads: null,
    pickup: false,
    visible: true,
    images: [
      {
        rowNo: 1,
        data: 'product3_image1',
      },
    ],
  },
];

const dummy_products_onlyInvisible = [
  {
    id: 4,
    'title_ja-JP': 'タイトル4',
    'title_en-US': 'title4',
    'subject_ja-JP': 'サブジェクト4',
    'subject_en-US': 'subject4',
    'body_ja-JP': 'ボディ4',
    'body_en-US': 'body4',
    skills: [{ key: 'icon4', icon: '' }],
    url_code: 'https://example.com/product_4/code',
    url_home: 'https://example.com/product_4/home',
    downloads: null,
    pickup: false,
    visible: false,
    images: [
      {
        rowNo: 1,
        data: 'product4_image1',
      },
    ],
  },
];

const dummy_products = [...dummy_products_onlyPickup, ...dummy_products_onlyNotPickup, ...dummy_products_onlyInvisible];

describe('Products', () => {
  const spy_useProducts = jest.spyOn(Hooks, 'useProducts');

  const original_IntersectionObserver = window.IntersectionObserver;
  const mock_IntersectionObserver = () => ({
    observe: () => jest.fn(),
    unobserve: () => jest.fn(),
    disconnect: () => jest.fn(),
  });

  beforeEach(() => {
    spy_useProducts.mockClear();
    window.IntersectionObserver = jest.fn().mockImplementation(mock_IntersectionObserver);
  });

  afterEach(() => {
    window.IntersectionObserver = original_IntersectionObserver;
  });

  test('プロダクトが存在する場合、コンポーネントが表示されること', () => {
    spy_useProducts.mockImplementation(() => dummy_products);

    render(<Products />);

    expect(screen.getByTestId('Products__SectionTitle')).toBeVisible();
    dummy_products
      ?.filter((product) => product.visible && product.pickup)
      .map((product, i) => {
        expect(screen.getByTestId(`Products__Product${i}__Name`)).toBeVisible();
        expect(screen.getByTestId(`Products__Product${i}__Summary`)).toBeVisible();
        expect(screen.getByTestId(`Products__Product${i}__Description`)).toBeVisible();
        expect(screen.getByTestId(`Products__Product${i}__Code`)).toBeVisible();
        expect(screen.getByTestId(`Products__Product${i}__Page`)).toBeVisible();
        product.skills.map((_, j) => {
          expect(screen.getByTestId(`Products__Product${i}__Skill${j}`)).toBeVisible();
        });

        expect(screen.getByTestId(`Products__Product${i}__Slider`)).toBeVisible();
        if (0 < product.images.length) expect(screen.getByTestId(`Products__Product${i}__Image0`)).toBeVisible();
        else expect(screen.queryByTestId(`Products__Product${i}__Image0`)).toBeNull();
      });

    const visibleProductCount = dummy_products?.filter((product) => product.visible && product.pickup).length;
    expect(screen.getByTestId('Products__Accordion')).toBeVisible();
    dummy_products
      ?.filter((product) => product.visible && !product.pickup)
      .map((product, index) => {
        const i = index + visibleProductCount;
        expect(screen.getByTestId(`Products__Product${i}__Name`)).toBeDefined();
        expect(screen.getByTestId(`Products__Product${i}__Summary`)).toBeDefined();
        expect(screen.getByTestId(`Products__Product${i}__Description`)).toBeDefined();
        expect(screen.getByTestId(`Products__Product${i}__Code`)).toBeDefined();
        expect(screen.getByTestId(`Products__Product${i}__Page`)).toBeDefined();
        product.skills.map((_, j) => {
          expect(screen.getByTestId(`Products__Product${i}__Skill${j}`)).toBeDefined();
        });

        expect(screen.queryByTestId(`Products__Product${i}__Slider`)).toBeNull();
        expect(screen.queryByTestId(`Products__Product${i}__Image0`)).toBeNull();
      });
  });

  test('プロダクト情報が取得前の場合、スケルトンスクリーンが表示されること', async () => {
    spy_useProducts.mockImplementation(() => undefined);

    render(<Products />);

    expect(screen.getByTestId('Products__SectionTitle')).toBeVisible();
    await Promise.all(
      [...Array(values.skeltonCount.products).keys()].map(async (i) => {
        await waitFor(() => expect(screen.getByTestId(`Products__Product${i}--Loading`)).toBeVisible());
        expect(screen.getByTestId(`Products__Product${i}__SkeletonName`)).toBeVisible();
        expect(screen.getByTestId(`Products__Product${i}__SkeletonSummary`)).toBeVisible();
        expect(screen.getByTestId(`Products__Product${i}__SkeletonDescription1`)).toBeVisible();
        expect(screen.getByTestId(`Products__Product${i}__SkeletonDescription2`)).toBeVisible();
        expect(screen.getByTestId(`Products__Product${i}__SkeletonDescription3`)).toBeVisible();
        expect(screen.getByTestId(`Products__Product${i}__SkeletonImage`)).toBeVisible();
      })
    );
  });

  test('プロダクトが存在しかつそのすべてがピックアップ設定されている場合、アコーディオンが表示されないこと', () => {
    spy_useProducts.mockImplementation(() => dummy_products_onlyPickup);

    render(<Products />);

    expect(screen.getByTestId(`Products__Product0__Name`)).toBeVisible();
    expect(screen.queryByTestId('Products__Accordion')).toBeNull();
  });

  test('プロダクトが存在しかつそのすべてがピックアップ設定されていない場合、アコーディオンが表示されないこと', () => {
    spy_useProducts.mockImplementation(() => dummy_products_onlyNotPickup);

    render(<Products />);

    expect(screen.getByTestId(`Products__Product0__Name`)).not.toBeVisible();
    expect(screen.getByTestId(`Products__Product0__Name`)).toBeDefined();
    expect(screen.getByTestId('Products__Accordion')).toBeVisible();
  });

  test('プロダクトが存在しかつそのすべてが非表示設定されている場合、コンポーネントとアコーディオンいずれも表示されないこと', () => {
    spy_useProducts.mockImplementation(() => dummy_products_onlyInvisible);

    render(<Products />);

    expect(screen.queryByTestId(`Products__Product0__Name`)).toBeNull();
    expect(screen.queryByTestId('Products__Accordion')).toBeNull();
  });

  test('アコーディオンを押下し、非違表示のコンポーネントが表示されること', () => {
    spy_useProducts.mockImplementation(() => dummy_products);

    render(<Products />);

    const visibleProductCount = dummy_products?.filter((product) => product.visible && product.pickup).length;
    userEvent.click(screen.getByTestId(`Products__Accordion`));
    dummy_products
      ?.filter((product) => product.visible && !product.pickup)
      .map(async (product, index) => {
        const i = index + visibleProductCount;
        await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Name`)).toBeVisible());
        await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Summary`)).toBeVisible());
        await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Description`)).toBeVisible());
        await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Code`)).toBeVisible());
        await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Page`)).toBeVisible());
        await Promise.all(
          product.skills.map(async (_, j) => {
            await waitFor(() => expect(screen.getByTestId(`Products__Product${i}__Skill${j}`)).toBeVisible());
          })
        );
      });
  });

  test('プロダクト名のリンク先がプロダクトのURLに設定されていること', async () => {
    spy_useProducts.mockImplementation(() => dummy_products);

    render(<Products />);

    screen.getAllByRole('link').map((element, i) => {
      expect(element.getAttribute('href')).toBe(dummy_products[i].url_home);
    });
  });

  test('CODEボタンを押下しリポジトリのURLが読み込まれること', async () => {
    spy_useProducts.mockImplementation(() => dummy_products);
    const mock_Open = jest.fn();
    window.open = mock_Open;

    render(<Products />);

    await Promise.all(
      dummy_products
        ?.filter((product) => product.visible)
        .map(async (product, i) => {
          userEvent.click(screen.getByTestId(`Products__Product${i}__Code`));
          await waitFor(() => expect(mock_Open).toBeCalledWith(product.url_code, '_blank'));
        })
    );
  });

  test('PAGEボタンを押下しプロダクトのURLが読み込まれること', async () => {
    spy_useProducts.mockImplementation(() => dummy_products);
    const mock_Open = jest.fn();
    window.open = mock_Open;

    render(<Products />);

    await Promise.all(
      dummy_products
        ?.filter((product) => product.visible)
        .map(async (product, i) => {
          userEvent.click(screen.getByTestId(`Products__Product${i}__Page`));
          await waitFor(() => expect(mock_Open).toBeCalledWith(product.url_home, '_blank'));
        })
    );
  });
});
