import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Articles } from '@/components/layouts/Articles';
import { values } from '@/constants';
import * as Hooks from '@/hooks';

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true, // 交差を検知した状態に固定する
  }),
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

jest.mock('@/hooks', () => ({
  useArticles: jest.fn(),
}));

const dummy_articles = {
  '1234567890': {
    title: '坊っちゃん',
    body: '慶応3年1月5日（新暦2月9日）江戸牛込馬場下横町に生まれる。本名は夏目金之助。帝国大学文科大学（東京大学文学部）を卒業後、東京高等師範学校、松山中学、第五高等学校などの教師生活を経て、1900年イギリスに留学する。帰国後、第一高等学校で教鞭をとりながら、1905年処女作「吾輩は猫である」を発表。1906年「坊っちゃん」「草枕」を発表。1907年教職を辞し、朝日新聞社に入社。そして「虞美人草」「三四郎」などを発表するが、胃病に苦しむようになる。1916年12月9日、「明暗」の連載途中に胃潰瘍で永眠。享年50歳であった。',
    url: 'https://example.com/1',
    tags: ['ちくま文庫', '筑摩書房'],
    likesCount: 1000,
    stocksCount: 500,
    image: 'example1',
  },
  abcdefghij: {
    title: '人間失格',
    body: '津軽の大地主の六男として生まれる。共産主義運動から脱落して遺書のつもりで書いた第一創作集のタイトルは「晩年」（昭和11年）という。この時太宰は27歳だった。その後太平洋戦争に向う時期から戦争末期までの困難な間も、妥協を許さない創作活動を続けた数少ない作家の一人である。戦後「斜陽」（昭和22年）は大きな反響を呼び、若い読者をひきつけた。',
    url: 'https://example.com/2',
    tags: ['新潮文庫', '新潮社'],
    likesCount: 100,
    stocksCount: 50,
    image: 'example2',
  },
  ABCDEFGHIJ: {
    title: '羅生門',
    body: '東大在学中に同人雑誌「新思潮」に発表した「鼻」を漱石が激賞し、文壇で活躍するようになる。王朝もの、近世初期のキリシタン文学、江戸時代の人物・事件、明治の文明開化期など、さまざまな時代の歴史的文献に題材をとり、スタイルや文体を使い分けたたくさんの短編小説を書いた。体力の衰えと「ぼんやりした不安」から自殺。その死は大正時代文学の終焉と重なっている。',
    url: 'https://example.com/3',
    tags: ['ほるぷ出版'],
    likesCount: 10,
    stocksCount: 5,
    image: 'example3',
  },
};

describe('Articles', () => {
  const spy_useArticles = jest.spyOn(Hooks, 'useArticles');

  const original_IntersectionObserver = window.IntersectionObserver;
  const mock_IntersectionObserver = () => ({
    observe: () => jest.fn(),
    unobserve: () => jest.fn(),
    disconnect: () => jest.fn(),
  });

  beforeEach(() => {
    spy_useArticles.mockClear();
    window.IntersectionObserver = jest.fn().mockImplementation(mock_IntersectionObserver);
  });

  afterEach(() => {
    window.IntersectionObserver = original_IntersectionObserver;
  });

  test('記事情報が存在する場合、コンポーネントが表示されること', () => {
    spy_useArticles.mockImplementation(() => dummy_articles);

    render(<Articles />);

    expect(screen.getByTestId('Articles__SectionTitle')).toBeVisible();
    Object.values(dummy_articles).map((article, i) => {
      expect(screen.getByTestId(`Articles__Card${i}__Body`)).toBeVisible();
      article.tags?.map((_, j) => {
        expect(screen.getByTestId(`Articles__Card${i}__Tag${j}`)).toBeVisible();
      });
      expect(screen.getByTestId(`Articles__Card${i}__LikesCount`)).toBeVisible();
      expect(screen.getByTestId(`Articles__Card${i}__StocksCount`)).toBeVisible();
    });
  });

  test('記事情報が取得前の場合、スケルトンスクリーンが表示されること', async () => {
    spy_useArticles.mockImplementation(() => undefined);

    render(<Articles />);

    expect(screen.getByTestId('Articles__SectionTitle')).toBeVisible();
    await Promise.all(
      [...Array(values.ARTICLES_SKELETON_DISPLAY_COUNT).keys()].map(async (i) => {
        await waitFor(() => expect(screen.getByTestId(`Articles__Card${i}--Loading`)).toBeVisible());
        expect(screen.getByTestId(`Articles__Card${i}__SkeletonBody0`)).toBeVisible();
        expect(screen.getByTestId(`Articles__Card${i}__SkeletonBody1`)).toBeVisible();
        expect(screen.getByTestId(`Articles__Card${i}__SkeletonBody2`)).toBeVisible();
        expect(screen.getByTestId(`Articles__Card${i}__SkeletonBody3`)).toBeVisible();
        expect(screen.getByTestId(`Articles__Card${i}__SkeletonTag0`)).toBeVisible();
        expect(screen.getByTestId(`Articles__Card${i}__SkeletonTag1`)).toBeVisible();
      })
    );
  });

  test('カードを押下し記事のURLが読み込まれること', async () => {
    spy_useArticles.mockImplementation(() => dummy_articles);
    const mock_Open = jest.fn();
    window.open = mock_Open;

    render(<Articles />);

    userEvent.click(screen.getByTestId('Articles__Card0__CardActionArea'));
    await waitFor(() => expect(mock_Open).toBeCalledWith(dummy_articles['1234567890'].url, '_blank'));
  });
});
