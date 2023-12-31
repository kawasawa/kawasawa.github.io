import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { CertificationData, useCertifications } from '@/hooks';
import * as Axios from '@/lib/axios';
import * as AppError from '@/utils/errors';

const MockComponent = ({ ready }: { ready: boolean }) => {
  const values = useCertifications(ready);
  return <div data-testid="MockComponent">{JSON.stringify(values)}</div>;
};

describe('useCertifications', () => {
  const spy_createInstance = jest.spyOn(Axios, 'createInstance');
  const spy_handleError = jest.spyOn(AppError, 'handleError');

  beforeEach(() => {
    spy_createInstance.mockClear();
    spy_handleError.mockClear();
  });

  test('APIを呼び出し表示データを取得できること', async () => {
    const dummy_certifications: { data: { values: string[][] } } = {
      data: {
        values: [
          ['id', 'date', 'title_ja-JP', 'title_en-US', 'subject_ja-JP', 'subject_en-US', 'favicon', 'url', 'visible'],
          [
            '1',
            '年月1',
            'タイトル1',
            'title1',
            'サブジェクト1',
            'subject1',
            'https://example.com/certification_1/favicon.ico',
            'https://example.com/certification_1',
            'true',
          ],
          [
            '2',
            '年月2',
            'タイトル2',
            'title2',
            'サブジェクト2',
            'subject2',
            'https://example.com/certification_2/favicon.ico',
            'https://example.com/certification_2',
            'false',
          ],
        ],
      },
    };

    const expect_certifications: CertificationData[] = [
      {
        id: 1,
        date: '年月1',
        'title_ja-JP': 'タイトル1',
        'title_en-US': 'title1',
        'subject_ja-JP': 'サブジェクト1',
        'subject_en-US': 'subject1',
        favicon: 'https://example.com/certification_1/favicon.ico',
        url: 'https://example.com/certification_1',
        visible: true,
      },
      {
        id: 2,
        date: '年月2',
        'title_ja-JP': 'タイトル2',
        'title_en-US': 'title2',
        'subject_ja-JP': 'サブジェクト2',
        'subject_en-US': 'subject2',
        favicon: 'https://example.com/certification_2/favicon.ico',
        url: 'https://example.com/certification_2',
        visible: false,
      },
    ];

    const mock_get = jest.fn().mockReturnValueOnce(dummy_certifications);
    spy_createInstance.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={true} />);

    await waitFor(() => expect(mock_get).toBeCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByTestId('MockComponent')).toHaveTextContent(JSON.stringify(expect_certifications))
    );
  });

  test('API呼び出し時にエラーが発生した場合、エラーがハンドルされること', async () => {
    const dummy_error = new Error('TEST_error');
    const mock_get = jest.fn().mockImplementation(() => {
      throw dummy_error;
    });
    spy_createInstance.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={true} />);

    await waitFor(() => expect(spy_handleError).toBeCalledWith(dummy_error));
  });

  test('ready状態でない場合、表示データが取得されないこと', async () => {
    const mock_get = jest.fn();
    spy_createInstance.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={false} />);

    await new Promise((_) => setTimeout(_, 100));
    expect(mock_get).not.toBeCalled();
    expect(screen.getByTestId('MockComponent')).toHaveTextContent('');
  });
});
