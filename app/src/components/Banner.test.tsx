import { Box, FadeProps } from '@mui/material';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Banner } from '@/components/Banner';
import { endpoints } from '@/constants';
import * as Strings from '@/utils/strings';

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
    jest.mock('@/components/controls', () => ({
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

  test('初期状態のコンポーネントが表示されること', () => {
    render(<Banner />);

    expect(screen.getByTestId('Banner__Image')).toBeVisible();
    expect(screen.getByTestId('Banner__Particles')).toBeVisible();
    expect(screen.getByTestId('Banner__Text')).toBeVisible();
    expect(screen.getByTestId('Banner__ScrollArrow')).toBeVisible();
    expect(screen.getByTestId('Banner__Alert')).toBeVisible();
    expect(spy_stringFormat).toBeCalled();
  });

  test('アラートを押下し指定されたURLが読み込まれること', async () => {
    const mock_Open = jest.fn();
    window.open = mock_Open;

    render(<Banner />);

    userEvent.click(screen.getByTestId('Banner__Alert'));
    await waitFor(() => expect(mock_Open).toBeCalledWith(endpoints.readme, '_blank'));
  });
});
