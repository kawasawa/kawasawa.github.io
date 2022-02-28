import { render, screen } from '@testing-library/react';
import React from 'react';

import { HideOnScroll } from '@/components/elements/HideOnScroll';

describe('HideOnScroll', () => {
  test('プロパティが授受されていること', () => {
    const children = 'dummy_children';
    render(
      <HideOnScroll>
        <div data-testid="HideOnScroll__div">{children}</div>
      </HideOnScroll>
    );

    expect(screen.getByTestId('HideOnScroll__div')).toHaveTextContent(children);
  });
});
