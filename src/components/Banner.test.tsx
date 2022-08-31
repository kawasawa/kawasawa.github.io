import { Box, FadeProps } from '@mui/material';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { constants } from '../constants';
import * as Strings from '../utils/strings';
import { Banner } from './Banner';

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true, // 交差を検知した状態に固定する
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => [jest.fn()],
}));

jest.mock(
  'react-tsparticles',
  () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _(props: any) {
      return <div data-testid={props['data-testid']}></div>;
    }
);

describe('Banner', () => {
  const mock_SectionFadeIn = React.forwardRef<
    unknown,
    FadeProps & {
      in: boolean;
    }
  >(function _(props, ref?) {
    return (
      <Box ref={ref} {...props}>
        {props.children}
      </Box>
    );
  });

  beforeAll(() => {
    jest.mock('./controls', () => ({
      SectionFadeIn: mock_SectionFadeIn,
    }));
  });

  const spy_stringFormat = jest.spyOn(Strings, 'stringFormat');

  const original_IntersectionObserver = window.IntersectionObserver;
  const mock_IntersectionObserver = () => ({
    observe: () => jest.fn(),
    unobserve: () => jest.fn(),
    disconnect: () => jest.fn(),
  });

  beforeEach(() => {
    spy_stringFormat.mockReset();
    spy_stringFormat.mockImplementation((str) => str);
    window.IntersectionObserver = jest.fn().mockImplementation(mock_IntersectionObserver);
  });

  afterEach(() => {
    window.IntersectionObserver = original_IntersectionObserver;
  });

  it('初期状態のコンポーネントが表示されること', () => {
    render(<Banner />);

    expect(screen.getByTestId('banner__image')).toBeVisible();
    expect(screen.getByTestId('banner__particles')).toBeVisible();
    expect(screen.getByTestId('banner__text')).toBeVisible();
    expect(screen.getByTestId('banner__alert')).toBeVisible();
    expect(spy_stringFormat).toBeCalled();
  });

  it('アラートを押下し指定されたURLが読み込まれること', async () => {
    const mock_Open = jest.fn();
    window.open = mock_Open;

    render(<Banner />);

    userEvent.click(screen.getByTestId('banner__alert'));
    await waitFor(() => expect(mock_Open).toBeCalledWith(constants.url.readme, '_blank'));
  });
});
