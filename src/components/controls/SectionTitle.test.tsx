import { render, screen } from '@testing-library/react';
import React from 'react';

import { SectionTitle } from './SectionTitle';

describe('SectionTitle', () => {
  it('プロパティが授受されていること', () => {
    const children = 'dummy_children';
    render(<SectionTitle>{children}</SectionTitle>);

    expect(screen.getByTestId('sectionTitle__Typography')).toHaveTextContent(children);
  });
});
