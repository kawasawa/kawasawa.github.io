import { render, screen } from '@testing-library/react';
import React from 'react';

import { SectionFadeIn } from './SectionFadeIn';

jest.mock('@mui/material/Fade', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function _(props: any) {
    return <div data-testid={props['data-testid']}>{JSON.stringify(props)}</div>;
  };
});

describe('SectionFadeIn', () => {
  it('プロパティが授受されていること', () => {
    const props = { timeout: 100, in: true, children: <></> };
    render(<SectionFadeIn {...props}>{props.children}</SectionFadeIn>);

    expect(screen.getByTestId('sectionFadeIn__Fade')).toHaveTextContent(
      JSON.stringify({ ...props, 'data-testid': 'sectionFadeIn__Fade' })
    );
  });

  it('timeoutが未指定の場合、既定値が設定されること', () => {
    const props = { in: true, children: <></> };
    render(<SectionFadeIn {...props}>{props.children}</SectionFadeIn>);

    expect(screen.getByTestId('sectionFadeIn__Fade')).toHaveTextContent(
      JSON.stringify({ timeout: 1000, ...props, 'data-testid': 'sectionFadeIn__Fade' })
    );
  });
});
