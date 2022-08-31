import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import * as Axios from '../api/axios';
import { articles } from '../models';
import * as Errors from '../utils/errors';
import { ArticleData, useArticles } from './useArticles';

const MockComponent = ({ ready }: { ready: boolean }) => {
  const articles = useArticles(ready);
  return <div data-testid="mock_Component">{JSON.stringify(articles)}</div>;
};

describe('useArticles', () => {
  const spy_createInstance = jest.spyOn(Axios, 'createInstance');
  const spy_handleError = jest.spyOn(Errors, 'handleError');

  beforeEach(() => {
    spy_createInstance.mockClear();
    spy_handleError.mockClear();
  });

  it('記事とサムネイルを取得できること', async () => {
    const dummy_metadata: { data: { values: string[][] } } = {
      data: {
        values: [
          ['id', 'title', 'body', 'tags', 'url', 'likes_count', 'comments_count', 'created_at', 'updated_at'],
          [
            articles[0].id,
            'タイトル１',
            'テキスト１',
            'タグ1_1',
            'https://example.com/article_1',
            '100',
            '0',
            '2020-01-01T12:34:56+09:00',
            '2021-01-01T12:34:56+09:00',
          ],
          [
            articles[1].id,
            'タイトル２',
            'テキスト２',
            'タグ2_1, タグ2_2',
            'https://example.com/article_2',
            '200',
            '0',
            '2020-01-01T12:34:56+09:00',
            '2021-01-01T12:34:56+09:00',
          ],
          [
            articles[2].id,
            'タイトル３',
            'テキスト３',
            'タグ3_1, タグ3_2, タグ3_3',
            'https://example.com/article_3',
            '300',
            '0',
            '2020-01-01T12:34:56+09:00',
            '2021-01-01T12:34:56+09:00',
          ],
          [
            'cc875adysf9w2kj9f9rn',
            'タイトル４',
            'テキスト４',
            'タグ4_1, タグ4_2, タグ4_3, タグ4_4',
            'https://example.com/article_4',
            '400',
            '0',
            '2020-01-01T12:34:56+09:00',
            '2021-01-01T12:34:56+09:00',
          ],
          [
            'v9k7nvijhx7kxew2nqwr',
            'タイトル５',
            'テキスト５',
            'タグ5_1, タグ5_2, タグ5_3,タグ5_4, タグ5_5',
            'https://example.com/article_5',
            '500',
            '0',
            '2020-01-01T12:34:56+09:00',
            '2021-01-01T12:34:56+09:00',
          ],
        ],
      },
    };

    const dummy_thumbnail = {
      data: {
        values: [
          ['id', 'data'],
          [articles[0].id, 'data:image/jpeg;base64,aaa'],
          [articles[1].id, 'data:image/jpeg;base64,bbb'],
          [articles[2].id, 'data:image/jpeg;base64,ccc'],
          ['cc875adysf9w2kj9f9rn', 'data:image/jpeg;base64,ddd'],
        ],
      },
    };

    const expect_articles: { [key: string]: ArticleData } = {
      [articles[0].id]: {
        title: 'タイトル１',
        body: 'テキスト１',
        url: 'https://example.com/article_1',
        tags: ['タグ1_1'],
        likesCount: 100,
        image: 'data:image/jpeg;base64,aaa',
      },
      [articles[1].id]: {
        title: 'タイトル２',
        body: 'テキスト２',
        url: 'https://example.com/article_2',
        tags: ['タグ2_1', 'タグ2_2'],
        likesCount: 200,
        image: 'data:image/jpeg;base64,bbb',
      },
      [articles[2].id]: {
        title: 'タイトル３',
        body: 'テキスト３',
        url: 'https://example.com/article_3',
        tags: ['タグ3_1', 'タグ3_2', 'タグ3_3'],
        likesCount: 300,
        image: 'data:image/jpeg;base64,ccc',
      },
    };

    const mock_get = jest.fn().mockReturnValueOnce(dummy_metadata).mockReturnValueOnce(dummy_thumbnail);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spy_createInstance.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={true} />);

    await waitFor(() => expect(mock_get).toBeCalledTimes(2));
    expect(screen.getByTestId('mock_Component')).toHaveTextContent(JSON.stringify(expect_articles));
  });

  it('記事とサムネイルを取得する際にエラーが発生した場合、エラーがハンドルされること', async () => {
    const err = new Error('TEST_error');
    const mock_get = jest.fn().mockImplementation(() => {
      throw err;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spy_createInstance.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={true} />);

    await waitFor(() => expect(spy_handleError).toBeCalledWith(err));
  });

  it('ready状態でない場合、記事とサムネイルが取得されないこと', async () => {
    const mock_get = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spy_createInstance.mockReturnValue({ get: mock_get } as unknown as any);

    render(<MockComponent ready={false} />);

    await new Promise((_) => setTimeout(_, 100));
    expect(mock_get).not.toBeCalled();
    expect(screen.getByTestId('mock_Component')).toHaveTextContent('');
  });
});
