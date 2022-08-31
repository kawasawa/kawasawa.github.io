import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('初期状態のコンポーネントが表示されること', () => {
    const mock_bottomContent = <div data-testid="mock__bottomContent"></div>;

    render(
      <ConfirmDialog
        open={true}
        title={''}
        message={''}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        affirmativeAction={() => {}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        negativeAction={() => {}}
        bottomContent={mock_bottomContent}
      />
    );

    expect(screen.getByTestId('confirmDialog__title')).toBeVisible();
    expect(screen.getByTestId('confirmDialog__message')).toBeVisible();
    expect(screen.getByTestId('confirmDialog__cancelButton')).toBeVisible();
    expect(screen.getByTestId('confirmDialog__cancelButton')).toHaveTextContent('Cancel');
    expect(screen.getByTestId('confirmDialog__okButton')).toBeVisible();
    expect(screen.getByTestId('confirmDialog__okButton')).toHaveTextContent('OK');
    expect(screen.getByTestId('mock__bottomContent')).toBeVisible();
  });

  it('プロパティが授受されていること', () => {
    render(
      <ConfirmDialog
        open={true}
        title={'TEST_title'}
        message={'TEST_message'}
        affirmativeText={'TEST_affirmativeText'}
        negativeText={'TEST_negativeText'}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        affirmativeAction={() => {}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        negativeAction={() => {}}
      />
    );

    expect(screen.getByTestId('confirmDialog__title')).toHaveTextContent('TEST_title');
    expect(screen.getByTestId('confirmDialog__message')).toHaveTextContent('TEST_message');
    expect(screen.getByTestId('confirmDialog__cancelButton')).toHaveTextContent('TEST_negativeText');
    expect(screen.getByTestId('confirmDialog__okButton')).toHaveTextContent('TEST_affirmativeText');
  });

  it('OKボタンを押下しaffirmativeActionが呼び出されること', () => {
    const mock_affirmativeAction = jest.fn();

    render(
      <ConfirmDialog
        open={true}
        title={''}
        message={''}
        affirmativeAction={mock_affirmativeAction}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        negativeAction={() => {}}
      />
    );
    userEvent.click(screen.getByTestId('confirmDialog__okButton'));

    expect(mock_affirmativeAction).toBeCalled();
  });

  it('キャンセルボタンを押下しnegativeActionが呼び出されること', () => {
    const mock_negativeAction = jest.fn();

    render(
      <ConfirmDialog
        open={true}
        title={''}
        message={''}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        affirmativeAction={() => {}}
        negativeAction={mock_negativeAction}
      />
    );
    userEvent.click(screen.getByTestId('confirmDialog__cancelButton'));

    expect(mock_negativeAction).toBeCalled();
  });
});
