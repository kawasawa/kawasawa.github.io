import { render, screen } from '@testing-library/react';
import React from 'react';

import { ChipList, ChipListItem } from '@/components/elements/ChipList';

describe('ChipList', () => {
  test('プロパティが授受されていること', () => {
    const children = 'dummy_children';
    render(<ChipList data-testid="ChipList">{children}</ChipList>);

    expect(screen.getByTestId('ChipList')).toHaveTextContent(children);
  });
});

describe('ChipListItem', () => {
  test('プロパティが授受されていること', () => {
    const children = 'dummy_children';
    render(<ChipListItem data-testid="ChipListItem">{children}</ChipListItem>);

    expect(screen.getByTestId('ChipListItem')).toHaveTextContent(children);
  });
});
