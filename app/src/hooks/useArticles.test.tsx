import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { ArticleData, useArticles } from '@/hooks';
import * as Axios from '@/lib/axios';
import * as AppError from '@/utils/errors';

const MockComponent = ({ ready }: { ready: boolean }) => {
  const values = useArticles(ready);
  return <div data-testid="MockComponent">{JSON.stringify(values)}</div>;
};

describe('useArticles', () => {
  const spy_getApiClient = jest.spyOn(Axios, 'getApiClient');
  const spy_handleError = jest.spyOn(AppError, 'handleError');

  beforeEach(() => {
    spy_getApiClient.mockClear();
    spy_handleError.mockClear();
  });

  test('記事とサムネイルを取得できること', async () => {
    const dummy_pickup = {
      data: {
        values: [
          ['id', 'data'],
          ['12345678901234567890', 'data:image/webp;base64,aaa'],
          ['22345678901234567890', 'data:image/webp;base64,bbb'],
          ['32345678901234567890', 'data:image/webp;base64,ccc'],
        ],
      },
    };

    const dummy_metadata: { data: { values: string[][] } } = {
      data: {
        values: [
          [
            'id',
            'title_ja-JP',
            'title_en-US',
            'body_ja-JP',
            'body_en-US',
            'tags',
            'url',
            'likes_count',
            'stocks_count',
            'comments_count',
            'created_at',
            'updated_at',
          ],
          [
            dummy_pickup.data.values[1][0],
            'タイトル１',
            'title1',
            'テキスト１',
            'text1',
            'タグ1_1',
            'https://example.com/article_1',
            '100',
            '50',
            '1',
            '2020-01-01T12:34:56+09:00',
            '2021-01-01T12:34:56+09:00',
          ],
          [
            dummy_pickup.data.values[2][0],
            'タイトル２',
            'title2',
            'テキスト２',
            'text2',
            'タグ2_1, タグ2_2',
            'https://example.com/article_2',
            '200',
            '100',
            '2',
            '2020-01-01T12:34:56+09:00',
            '2021-01-01T12:34:56+09:00',
          ],
          [
            dummy_pickup.data.values[3][0],
            'タイトル３',
            'title3',
            'テキスト３',
            'text3',
            'タグ3_1, タグ3_2, タグ3_3',
            'https://example.com/article_3',
            '300',
            '150',
            '3',
            '2020-01-01T12:34:56+09:00',
            '2021-01-01T12:34:56+09:00',
          ],
          [
            'HOGE_HOGE_HOGE_HOGE_',
            'タイトル４',
            'title4',
            'テキスト４',
            'text4',
            'タグ4_1, タグ4_2, タグ4_3, タグ4_4',
            'https://example.com/article_4',
            '400',
            '200',
            '4',
            '2020-01-01T12:34:56+09:00',
            '2021-01-01T12:34:56+09:00',
          ],
          [
            'FUGA_FUGA_FUGA_FUGA_',
            'タイトル５',
            'title5',
            'テキスト５',
            'text5',
            'タグ5_1, タグ5_2, タグ5_3,タグ5_4, タグ5_5',
            'https://example.com/article_5',
            '500',
            '250',
            '5',
            '2020-01-01T12:34:56+09:00',
            '2021-01-01T12:34:56+09:00',
          ],
        ],
      },
    };

    const expect_articles: { [key: string]: ArticleData } = {
      [dummy_pickup.data.values[1][0]]: {
        image: 'data:image/webp;base64,aaa',
        'title_ja-JP': 'タイトル１',
        'title_en-US': 'title1',
        'body_ja-JP': 'テキスト１',
        'body_en-US': 'text1',
        url: 'https://example.com/article_1',
        tags: ['タグ1_1'],
        likesCount: 100,
        stocksCount: 50,
        commentsCount: 1,
      },
      [dummy_pickup.data.values[2][0]]: {
        image: 'data:image/webp;base64,bbb',
        'title_ja-JP': 'タイトル２',
        'title_en-US': 'title2',
        'body_ja-JP': 'テキスト２',
        'body_en-US': 'text2',
        url: 'https://example.com/article_2',
        tags: ['タグ2_1', 'タグ2_2'],
        likesCount: 200,
        stocksCount: 100,
        commentsCount: 2,
      },
      [dummy_pickup.data.values[3][0]]: {
        image: 'data:image/webp;base64,ccc',
        'title_ja-JP': 'タイトル３',
        'title_en-US': 'title3',
        'body_ja-JP': 'テキスト３',
        'body_en-US': 'text3',
        url: 'https://example.com/article_3',
        tags: ['タグ3_1', 'タグ3_2', 'タグ3_3'],
        likesCount: 300,
        stocksCount: 150,
        commentsCount: 3,
      },
    };

    const mock_get = jest.fn().mockReturnValueOnce(dummy_pickup).mockReturnValueOnce(dummy_metadata);
    spy_getApiClient.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={true} />);

    await waitFor(() => expect(mock_get).toBeCalledTimes(2));
    await waitFor(() => expect(screen.getByTestId('MockComponent')).toHaveTextContent(JSON.stringify(expect_articles)));
  });

  test('記事とサムネイルを取得する際にエラーが発生した場合、エラーがハンドルされること', async () => {
    const error = new Error('TEST_error');
    const mock_get = jest.fn().mockImplementation(() => {
      throw error;
    });
    spy_getApiClient.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={true} />);

    await waitFor(() => expect(spy_handleError).toBeCalledWith(error));
  });

  test('ready状態でない場合、記事とサムネイルが取得されないこと', async () => {
    const mock_get = jest.fn();
    spy_getApiClient.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={false} />);

    await new Promise((_) => setTimeout(_, 100));
    expect(mock_get).not.toBeCalled();
    expect(screen.getByTestId('MockComponent')).toHaveTextContent('');
  });
});
