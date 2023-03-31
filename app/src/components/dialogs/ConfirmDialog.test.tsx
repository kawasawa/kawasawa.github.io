import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';

describe('ConfirmDialog', () => {
  test('初期状態のコンポーネントが表示されること', () => {
    const mock_bottomContent = <div data-testid="mock__BottomContent"></div>;

    render(
      <ConfirmDialog
        open={true}
        title={''}
        message={''}
        affirmativeAction={() => {}}
        negativeAction={() => {}}
        bottomContent={mock_bottomContent}
      />
    );

    expect(screen.getByTestId('ConfirmDialog__Title')).toBeVisible();
    expect(screen.getByTestId('ConfirmDialog__Message')).toBeVisible();
    expect(screen.getByTestId('ConfirmDialog__Cancel')).toBeVisible();
    expect(screen.getByTestId('ConfirmDialog__Cancel')).toHaveTextContent('Cancel');
    expect(screen.getByTestId('ConfirmDialog__OK')).toBeVisible();
    expect(screen.getByTestId('ConfirmDialog__OK')).toHaveTextContent('OK');
    expect(screen.getByTestId('mock__BottomContent')).toBeVisible();
    expect(screen.getByTestId('ConfirmDialog__OK')).not.toHaveClass('MuiButton-containedError');
  });

  test('プロパティが授受されていること', () => {
    render(
      <ConfirmDialog
        open={true}
        title={'test_title'}
        message={'test_message'}
        affirmativeText={'test_affirmativeText'}
        negativeText={'test_negativeText'}
        affirmativeAction={() => {}}
        negativeAction={() => {}}
        danger
      />
    );

    expect(screen.getByTestId('ConfirmDialog__Title')).toHaveTextContent('test_title');
    expect(screen.getByTestId('ConfirmDialog__Message')).toHaveTextContent('test_message');
    expect(screen.getByTestId('ConfirmDialog__Cancel')).toHaveTextContent('test_negativeText');
    expect(screen.getByTestId('ConfirmDialog__OK')).toHaveTextContent('test_affirmativeText');
    expect(screen.getByTestId('ConfirmDialog__OK')).toHaveClass('MuiButton-containedError');
  });

  test('OKボタンを押下しaffirmativeActionが呼び出されること', () => {
    const mock_affirmativeAction = jest.fn();

    render(
      <ConfirmDialog
        open={true}
        title={''}
        message={''}
        affirmativeAction={mock_affirmativeAction}
        negativeAction={() => {}}
      />
    );
    userEvent.click(screen.getByTestId('ConfirmDialog__OK'));

    expect(mock_affirmativeAction).toBeCalled();
  });

  test('キャンセルボタンを押下しnegativeActionが呼び出されること', () => {
    const mock_negativeAction = jest.fn();

    render(
      <ConfirmDialog
        open={true}
        title={''}
        message={''}
        affirmativeAction={() => {}}
        negativeAction={mock_negativeAction}
      />
    );
    userEvent.click(screen.getByTestId('ConfirmDialog__Cancel'));

    expect(mock_negativeAction).toBeCalled();
  });
});
