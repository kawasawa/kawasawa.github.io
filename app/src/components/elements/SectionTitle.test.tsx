import { render, screen } from '@testing-library/react';
import React from 'react';

import { SectionTitle } from '@/components/elements/SectionTitle';

describe('SectionTitle', () => {
  test('プロパティが授受されていること', () => {
    const children = 'dummy_children';
    render(<SectionTitle>{children}</SectionTitle>);

    expect(screen.getByTestId('SectionTitle__Typography')).toHaveTextContent(children);
  });
});
