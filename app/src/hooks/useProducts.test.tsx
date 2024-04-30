import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { ProductData, useProducts } from '@/hooks';
import * as Axios from '@/lib/axios';
import * as AppError from '@/utils/errors';

const MockComponent = ({ ready }: { ready: boolean }) => {
  const values = useProducts(ready);
  return <div data-testid="MockComponent">{JSON.stringify(values)}</div>;
};

describe('useProducts', () => {
  const spy_getApiClient = jest.spyOn(Axios, 'getApiClient');
  const spy_handleError = jest.spyOn(AppError, 'handleError');

  beforeEach(() => {
    spy_getApiClient.mockClear();
    spy_handleError.mockClear();
  });

  test('APIを呼び出し表示データを取得できること', async () => {
    const dummy_icons = {
      data: {
        values: [
          ['id', 'data'],
          ['icon1', 'data1'],
          ['icon2', 'data2'],
        ],
      },
    };

    const dummy_products: { data: { values: string[][] } } = {
      data: {
        values: [
          [
            'id',
            'title_ja-JP',
            'title_en-US',
            'subject_ja-JP',
            'subject_en-US',
            'body_ja-JP',
            'body_en-US',
            'skills',
            'url_code',
            'url_home',
            'downloads',
            'pickup',
            'visible',
          ],
          [
            '1',
            'タイトル1',
            'title1',
            'サブジェクト1',
            'subject1',
            'ボディ1',
            'body1',
            'icon1, icon2',
            'https://example.com/product_1/code',
            'https://example.com/product_1/home',
            '1',
            'true',
            'true',
          ],
          [
            '2',
            'タイトル2',
            'title2',
            'サブジェクト2',
            'subject2',
            'ボディ2',
            'body2',
            'icon3',
            'https://example.com/product_2/code',
            'https://example.com/product_2/home',
            '',
            'false',
            'false',
          ],
        ],
      },
    };

    const dummy_productImages: { data: { values: string[][] } } = {
      data: {
        values: [
          ['product_id', 'row_no', 'data'],
          ['1', '1', 'product1_image1'],
          ['1', '2', 'product1_image2'],
          ['9', '9', 'product9_image1'],
        ],
      },
    };

    const expect_products: ProductData[] = [
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
        skills: [{ key: 'icon3', icon: '' }],
        url_code: 'https://example.com/product_2/code',
        url_home: 'https://example.com/product_2/home',
        downloads: null,
        pickup: false,
        visible: false,
        images: [],
      },
    ];

    const mock_get = jest
      .fn()
      .mockReturnValueOnce(dummy_products)
      .mockReturnValueOnce(dummy_productImages)
      .mockReturnValueOnce(dummy_icons);
    spy_getApiClient.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={true} />);

    await waitFor(() => expect(mock_get).toBeCalledTimes(3));
    await waitFor(() => expect(screen.getByTestId('MockComponent')).toHaveTextContent(JSON.stringify(expect_products)));
  });

  test('API呼び出し時にエラーが発生した場合、エラーがハンドルされること', async () => {
    const dummy_error = new Error('TEST_error');
    const mock_get = jest.fn().mockImplementation(() => {
      throw dummy_error;
    });
    spy_getApiClient.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={true} />);

    await waitFor(() => expect(spy_handleError).toBeCalledWith(dummy_error));
  });

  test('ready状態でない場合、表示データが取得されないこと', async () => {
    const mock_get = jest.fn();
    spy_getApiClient.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={false} />);

    await new Promise((_) => setTimeout(_, 100));
    expect(mock_get).not.toBeCalled();
    expect(screen.getByTestId('MockComponent')).toHaveTextContent('');
  });
});
