import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { CareerData, useCareers } from '@/hooks';
import * as Axios from '@/lib/axios';
import * as AppError from '@/utils/errors';

const MockComponent = ({ ready }: { ready: boolean }) => {
  const values = useCareers(ready);
  return <div data-testid="MockComponent">{JSON.stringify(values)}</div>;
};

describe('useCareers', () => {
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

    const dummy_careers: { data: { values: string[][] } } = {
      data: {
        values: [
          ['id', 'date', 'place', 'title_ja-JP', 'title_en-US', 'favicon', 'url', 'visible'],
          [
            '1',
            '年月1',
            '場所1',
            'タイトル1',
            'title1',
            'https://example.com/career_1/favicon.ico',
            'https://example.com/career_1',
            'true',
          ],
          [
            '2',
            '年月2',
            '場所2',
            'タイトル2',
            'title2',
            'https://example.com/career_2/favicon.ico',
            'https://example.com/career_2',
            'false',
          ],
        ],
      },
    };

    const dummy_careerDetails: { data: { values: string[][] } } = {
      data: {
        values: [
          ['career_id', 'row_no', 'subject_ja-JP', 'subject_en-US', 'skills'],
          ['1', '1', 'サブジェクト1_1', 'subject1_1', 'icon1'],
          ['2', '1', 'サブジェクト2_1', 'subject2_1', 'icon1, icon2'],
          ['2', '2', 'サブジェクト2_2', 'subject2_2', 'icon3'],
          ['9', '9', 'サブジェクト9_1', 'subject9_1', 'icon9'],
        ],
      },
    };

    const expect_careers: CareerData[] = [
      {
        id: 1,
        date: '年月1',
        place: '場所1',
        'title_ja-JP': 'タイトル1',
        'title_en-US': 'title1',
        favicon: 'https://example.com/career_1/favicon.ico',
        url: 'https://example.com/career_1',
        visible: true,
        details: [
          {
            rowNo: 1,
            'subject_ja-JP': 'サブジェクト1_1',
            'subject_en-US': 'subject1_1',
            skills: [{ key: 'icon1', icon: 'data1' }],
          },
        ],
      },
      {
        id: 2,
        date: '年月2',
        place: '場所2',
        'title_ja-JP': 'タイトル2',
        'title_en-US': 'title2',
        favicon: 'https://example.com/career_2/favicon.ico',
        url: 'https://example.com/career_2',
        visible: false,
        details: [
          {
            rowNo: 1,
            'subject_ja-JP': 'サブジェクト2_1',
            'subject_en-US': 'subject2_1',
            skills: [
              { key: 'icon1', icon: 'data1' },
              { key: 'icon2', icon: 'data2' },
            ],
          },
          {
            rowNo: 2,
            'subject_ja-JP': 'サブジェクト2_2',
            'subject_en-US': 'subject2_2',
            skills: [{ key: 'icon3', icon: '' }],
          },
        ],
      },
    ];

    const mock_get = jest
      .fn()
      .mockReturnValueOnce(dummy_careers)
      .mockReturnValueOnce(dummy_careerDetails)
      .mockReturnValueOnce(dummy_icons);
    spy_getApiClient.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={true} />);

    await waitFor(() => expect(mock_get).toBeCalledTimes(3));
    await waitFor(() => expect(screen.getByTestId('MockComponent')).toHaveTextContent(JSON.stringify(expect_careers)));
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
