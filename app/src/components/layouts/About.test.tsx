import * as EmailJs from '@emailjs/browser';
import { useMediaQuery } from '@mui/material';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as ReactToastify from 'react-toastify';

import { ConfirmDialogProps, PrivacyPolicyDialogProps } from '@/components/dialogs';
import { About } from '@/components/layouts/About';
import { career, certification, sns } from '@/entities';
import * as AppError from '@/utils/errors';

jest.mock('@emailjs/browser', () => ({
  init: jest.fn(),
  send: jest.fn(),
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}));

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: true, // 交差を検知した状態に固定する
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => [jest.fn()],
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn() },
}));

jest.mock('@/utils/errors', () => ({
  handleError: jest.fn(),
}));

jest.mock('@/components/elements', () => {
  const { forwardRef } = jest.requireActual('react');
  return {
    ChipList: (props: any) => <div data-testid={props['data-testid']}>{props.children}</div>,
    ChipListItem: (props: any) => <div data-testid={props['data-testid']}></div>,
    SectionTitle: (props: any) => <div data-testid={props['data-testid']}></div>,
    SectionFadeIn: forwardRef((props: any, ref: any) => (
      <div ref={ref} {...props}>
        {props.children}{' '}
      </div>
    )),
  };
});

jest.mock('@/components/dialogs', () => ({
  ConfirmDialog: (props: ConfirmDialogProps) => (
    <div data-testid="mock__ConfirmDialog" style={{ visibility: props.open ? 'visible' : 'hidden' }}>
      <button
        data-testid="mock__ConfirmDialog__OK"
        onClick={() => props.affirmativeAction && props.affirmativeAction()}
      />
      <button
        data-testid="mock__ConfirmDialog__Cancel"
        onClick={() => props.negativeAction && props.negativeAction()}
      />
    </div>
  ),
  PrivacyPolicyDialog: (props: PrivacyPolicyDialogProps) => (
    <div data-testid="mock__PrivacyPolicyDialog" style={{ visibility: props.open ? 'visible' : 'hidden' }}>
      <button data-testid="mock__PrivacyPolicyDialog__Close" onClick={() => props.closeAction && props.closeAction()} />
    </div>
  ),
}));

jest.mock('@/pages', () => ({
  PendingContext: React.createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([false, jest.fn()]),
}));

const dummy_contactData = {
  name: 'ichiro suzuki',
  email: 'test@example.com',
  message: 'hogehoge fugafuga piyopiyo',
};

describe('About', () => {
  const spy_init = jest.spyOn(EmailJs, 'init');
  const spy_send = jest.spyOn(EmailJs, 'send');
  const spy_toastSuccess = jest.spyOn(ReactToastify.toast, 'success');
  const spy_handleError = jest.spyOn(AppError, 'handleError');

  const original_IntersectionObserver = window.IntersectionObserver;
  const mock_IntersectionObserver = () => ({
    observe: () => jest.fn(),
    unobserve: () => jest.fn(),
    disconnect: () => jest.fn(),
  });

  beforeEach(() => {
    spy_init.mockClear();
    spy_send.mockClear();
    spy_toastSuccess.mockClear();
    spy_handleError.mockClear();
    window.IntersectionObserver = jest.fn().mockImplementation(mock_IntersectionObserver);
  });

  afterEach(() => {
    window.IntersectionObserver = original_IntersectionObserver;
  });

  test('初期状態のコンポーネントが表示されること（スマートフォンサイズ）', () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);

    render(<About />);

    expect(screen.getByTestId('About__SectionTitle')).toBeVisible();
    expect(screen.getAllByTestId('About__Author__Name').length).toBe(2);
    expect(screen.getAllByTestId('About__Author__Job').length).toBe(2);
    sns.map((_, i) => {
      expect(screen.getByTestId(`About__SNS${i}`)).toBeVisible();
    });
    career.map((career, i) => {
      expect(screen.getAllByTestId(`About__Career${i}`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Career${i}__Date`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Career${i}__Place`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Career${i}__Favicon`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Career${i}__Name`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Career${i}__Body`).length).toBe(2);
      career.skills.map((_, j) => {
        expect(screen.getAllByTestId(`About__Career${i}__Skill${j}`).length).toBe(2);
      });
    });
    certification.map((_, i) => {
      expect(screen.getAllByTestId(`About__Certification${i}`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Certification${i}__Date`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Certification${i}__Favicon`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Certification${i}__Name`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Certification${i}__Body`).length).toBe(2);
    });
    expect(screen.getByTestId('About__Contact__Name')).toBeVisible();
    expect(screen.getByTestId('About__Contact__Email')).toBeVisible();
    expect(screen.getByTestId('About__Contact__Message')).toBeVisible();
    expect(screen.getByTestId('About__Contact__Send')).toBeVisible();
    expect(screen.getByTestId('About__Contact__Attention')).toBeVisible();
    expect(screen.getByTestId('About__Contact__PrivacyPolicy')).toBeVisible();
  });

  test('初期状態のコンポーネントが表示されること（PCサイズ）', () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(false);

    render(<About />);

    expect(screen.getByTestId('About__SectionTitle')).toBeVisible();
    expect(screen.getAllByTestId('About__Author__Name').length).toBe(2);
    expect(screen.getAllByTestId('About__Author__Job').length).toBe(2);
    sns.map((_, i) => {
      expect(screen.getByTestId(`About__SNS${i}`)).toBeVisible();
    });
    career.map((career, i) => {
      expect(screen.getAllByTestId(`About__Career${i}`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Career${i}__Date`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Career${i}__Place`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Career${i}__Favicon`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Career${i}__Name`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Career${i}__Body`).length).toBe(2);
      career.skills.map((_, j) => {
        expect(screen.getAllByTestId(`About__Career${i}__Skill${j}`).length).toBe(2);
      });
    });
    certification.map((_, i) => {
      expect(screen.getAllByTestId(`About__Certification${i}`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Certification${i}__Date`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Certification${i}__Favicon`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Certification${i}__Name`).length).toBe(2);
      expect(screen.getAllByTestId(`About__Certification${i}__Body`).length).toBe(2);
    });
    expect(screen.getByTestId('About__Contact__Name')).toBeVisible();
    expect(screen.getByTestId('About__Contact__Email')).toBeVisible();
    expect(screen.getByTestId('About__Contact__Message')).toBeVisible();
    expect(screen.getByTestId('About__Contact__Send')).toBeVisible();
    expect(screen.getByTestId('About__Contact__Attention')).toBeVisible();
    expect(screen.getByTestId('About__Contact__PrivacyPolicy')).toBeVisible();
  });

  test('問い合わせフォームの全ての入力欄に正常フォーマットな値を設定することで送信ボタンが活性化されること', async () => {
    render(<About />);

    await waitFor(() => expect(screen.getByTestId('About__Contact__Send')).not.toBeEnabled());
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Name'), dummy_contactData.name));
    await waitFor(() =>
      expect((screen.getByTestId('About__Contact__Name') as HTMLInputElement).value).toBe(dummy_contactData.name)
    );
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Email'), dummy_contactData.email));
    await waitFor(() =>
      expect((screen.getByTestId('About__Contact__Email') as HTMLInputElement).value).toBe(dummy_contactData.email)
    );
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Message'), dummy_contactData.message));
    await waitFor(() =>
      expect((screen.getByTestId('About__Contact__Message') as HTMLInputElement).value).toBe(dummy_contactData.message)
    );
    await waitFor(() => expect(screen.getByTestId('About__Contact__Send')).toBeEnabled());
  });

  test('問い合わせフォームのメールアドレスがフォーマット不正の場合、送信ボタンが活性化されないこと', async () => {
    render(<About />);

    await waitFor(() => expect(screen.getByTestId('About__Contact__Send')).not.toBeEnabled());
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Name'), dummy_contactData.name));
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Email'), 'INVALID_EMAIL_FORMAT'));
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Message'), dummy_contactData.name));
    await new Promise((_) => setTimeout(_, 100));
    await waitFor(() => expect(screen.getByTestId('About__Contact__Send')).not.toBeEnabled());
  });

  test('問い合わせフォームで送信ボタンを押下し問い合わせ確認ダイアログが表示されること', async () => {
    render(<About />);

    await act(() => userEvent.type(screen.getByTestId('About__Contact__Name'), dummy_contactData.name));
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Email'), dummy_contactData.email));
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Message'), dummy_contactData.message));
    await new Promise((_) => setTimeout(_, 100));

    await waitFor(() => expect(screen.getByTestId('mock__ConfirmDialog')).not.toBeVisible());
    await act(() => userEvent.click(screen.getByTestId('About__Contact__Send')));
    await waitFor(() => expect(screen.getByTestId('mock__ConfirmDialog')).toBeVisible());
  });

  test('問い合わせ確認ダイアログでOKボタンを押下し、問い合わせフォームに入力した内容が送信されること', async () => {
    render(<About />);

    await act(() => userEvent.type(screen.getByTestId('About__Contact__Name'), dummy_contactData.name));
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Email'), dummy_contactData.email));
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Message'), dummy_contactData.message));
    await new Promise((_) => setTimeout(_, 100));
    await act(() => userEvent.click(screen.getByTestId('About__Contact__Send')));

    await waitFor(() => expect(screen.getByTestId('mock__ConfirmDialog')).toBeVisible());
    await act(() => userEvent.click(screen.getByTestId('mock__ConfirmDialog__OK')));

    await waitFor(() => expect(spy_init).toBeCalledWith(process.env.REACT_APP_EMAILJS_PUBLIC_KEY));
    await waitFor(() =>
      expect(spy_send).toBeCalledWith(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        dummy_contactData
      )
    );
    await waitFor(() => expect(spy_toastSuccess).toBeCalled());
    await waitFor(() => expect(screen.getByTestId('mock__ConfirmDialog')).not.toBeVisible());
  });

  test('問い合わせ送信時にエラーが発生した場合、エラーがハンドルされること', async () => {
    const error = new Error('TEST_error');
    spy_init.mockImplementation(() => {
      throw error;
    });

    render(<About />);

    await act(() => userEvent.type(screen.getByTestId('About__Contact__Name'), dummy_contactData.name));
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Email'), dummy_contactData.email));
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Message'), dummy_contactData.message));
    await new Promise((_) => setTimeout(_, 100));
    await act(() => userEvent.click(screen.getByTestId('About__Contact__Send')));

    await waitFor(() => expect(screen.getByTestId('mock__ConfirmDialog')).toBeVisible());
    await act(() => userEvent.click(screen.getByTestId('mock__ConfirmDialog__OK')));

    await waitFor(() => expect(spy_handleError).toBeCalledWith(error));
    await waitFor(() => expect(screen.getByTestId('mock__ConfirmDialog')).not.toBeVisible());
  });

  test('問い合わせ確認ダイアログでキャンセルボタンを押下し、送信が行われないこと', async () => {
    render(<About />);

    await act(() => userEvent.type(screen.getByTestId('About__Contact__Name'), dummy_contactData.name));
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Email'), dummy_contactData.email));
    await act(() => userEvent.type(screen.getByTestId('About__Contact__Message'), dummy_contactData.message));
    await new Promise((_) => setTimeout(_, 100));
    await act(() => userEvent.click(screen.getByTestId('About__Contact__Send')));

    await waitFor(() => expect(screen.getByTestId('mock__ConfirmDialog')).toBeVisible());
    await act(() => userEvent.click(screen.getByTestId('mock__ConfirmDialog__Cancel')));

    await new Promise((_) => setTimeout(_, 100));
    await waitFor(() => expect(spy_init).not.toBeCalled());
    await waitFor(() => expect(spy_send).not.toBeCalled());
    await waitFor(() => expect(screen.getByTestId('mock__ConfirmDialog')).not.toBeVisible());
  });

  test('リンクを押下しプライバシーポリシーが表示されること', async () => {
    render(<About />);

    await waitFor(() => expect(screen.getByTestId('mock__PrivacyPolicyDialog')).not.toBeVisible());
    await act(() => userEvent.click(screen.getByTestId('About__Contact__PrivacyPolicy')));
    await waitFor(() => expect(screen.getByTestId('mock__PrivacyPolicyDialog')).toBeVisible());
    await act(() => userEvent.click(screen.getByTestId('mock__PrivacyPolicyDialog__Close')));
    await waitFor(() => expect(screen.getByTestId('mock__PrivacyPolicyDialog')).not.toBeVisible());
  });
});
