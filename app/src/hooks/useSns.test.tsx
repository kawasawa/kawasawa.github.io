import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { Sns, useSns } from '@/hooks';
import * as Axios from '@/lib/axios';
import * as AppError from '@/utils/errors';

const MockComponent = ({ ready }: { ready: boolean }) => {
  const values = useSns(ready);
  return <div data-testid="MockComponent">{JSON.stringify(values)}</div>;
};

describe('useSns', () => {
  const spy_getApiClient = jest.spyOn(Axios, 'getApiClient');
  const spy_handleError = jest.spyOn(AppError, 'handleError');

  beforeEach(() => {
    spy_getApiClient.mockClear();
    spy_handleError.mockClear();
  });

  test('APIを呼び出し表示データを取得できること', async () => {
    const dummy_sns: { data: { values: string[][] } } = {
      data: {
        values: [
          ['id', 'title_ja-JP', 'title_en-US', 'favicon', 'url', 'visible'],
          ['1', 'タイトル1', 'title1', 'https://example.com/sns_1/favicon.ico', 'https://example.com/sns_1', 'true'],
          ['2', 'タイトル2', 'title2', 'https://example.com/sns_2/favicon.ico', 'https://example.com/sns_2', 'false'],
        ],
      },
    };

    const expect_sns: Sns[] = [
      {
        id: 1,
        'title_ja-JP': 'タイトル1',
        'title_en-US': 'title1',
        favicon: 'https://example.com/sns_1/favicon.ico',
        url: 'https://example.com/sns_1',
        visible: true,
      },
      {
        id: 2,
        'title_ja-JP': 'タイトル2',
        'title_en-US': 'title2',
        favicon: 'https://example.com/sns_2/favicon.ico',
        url: 'https://example.com/sns_2',
        visible: false,
      },
    ];

    const mock_get = jest.fn().mockReturnValueOnce(dummy_sns);
    spy_getApiClient.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={true} />);

    await waitFor(() => expect(mock_get).toBeCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('MockComponent')).toHaveTextContent(JSON.stringify(expect_sns)));
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
