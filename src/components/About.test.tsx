import * as EmailJs from '@emailjs/browser';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as ReactToastify from 'react-toastify';

import { career, certification, skill, sns } from '../models';
import * as Errors from '../utils/errors';
import { About } from './About';
import { ConfirmDialogProps, PrivacyPolicyDialogProps } from './dialogs';

jest.mock('@emailjs/browser', () => ({
  init: jest.fn(),
  send: jest.fn(),
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

jest.mock('./controls', () => {
  const { forwardRef } = jest.requireActual('react');
  const { Box } = jest.requireActual('@mui/material');
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ChipList: (props: any) => <div data-testid={props['data-testid']}>{props.children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ChipListItem: (props: any) => <div data-testid={props['data-testid']}></div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SectionTitle: (props: any) => <div data-testid={props['data-testid']}></div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SectionFadeIn: forwardRef(function _(props: any, ref: any) {
      return (
        <Box ref={ref} {...props}>
          {props.children}
        </Box>
      );
    }),
  };
});

jest.mock('./dialogs', () => {
  return {
    ConfirmDialog: (props: ConfirmDialogProps) => (
      <div data-testid="mock__ConfirmDialog" style={{ visibility: props.open ? 'visible' : 'hidden' }}>
        <button
          data-testid="mock__ConfirmDialog--okButton"
          onClick={() => props.affirmativeAction && props.affirmativeAction()}
        />
        <button
          data-testid="mock__ConfirmDialog--cancelButton"
          onClick={() => props.negativeAction && props.negativeAction()}
        />
      </div>
    ),
    PrivacyPolicyDialog: (props: PrivacyPolicyDialogProps) => (
      <div data-testid="mock__PrivacyPolicyDialog" style={{ visibility: props.open ? 'visible' : 'hidden' }}>
        <button
          data-testid="mock__PrivacyPolicyDialog--closeButton"
          onClick={() => props.closeAction && props.closeAction()}
        />
      </div>
    ),
  };
});

const dummy_contactData = {
  name: 'ichiro suzuki',
  email: 'test@example.com',
  message: 'hogehoge fugafuga piyopiyo',
};

describe('Products', () => {
  const spy_init = jest.spyOn(EmailJs, 'init');
  const spy_send = jest.spyOn(EmailJs, 'send');
  const spy_toastSuccess = jest.spyOn(ReactToastify.toast, 'success');
  const spy_handleError = jest.spyOn(Errors, 'handleError');

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

  it('初期状態のコンポーネントが表示されること', () => {
    render(<About />);

    expect(screen.getByTestId('about__SectionTitle')).toBeVisible();
    expect(screen.getAllByTestId('about__Author--name').length).toBe(2);
    expect(screen.getAllByTestId('about__Author--job').length).toBe(2);
    sns.map((_, i) => {
      expect(screen.getByTestId(`about__Sns${i}`)).toBeVisible();
    });
    skill.map((skill, i) => {
      expect(screen.getAllByTestId(`about__Skills${i}`).length).toBe(2);
      skill.tags.map((_, j) => {
        expect(screen.getAllByTestId(`about__Skills${i}--tag${j}`).length).toBe(2);
      });
    });
    career.map((_, i) => {
      expect(screen.getAllByTestId(`about__Career${i}`).length).toBe(2);
      expect(screen.getAllByTestId(`about__Career${i}--date`).length).toBe(2);
      expect(screen.getAllByTestId(`about__Career${i}--place`).length).toBe(2);
      expect(screen.getAllByTestId(`about__Career${i}--favicon`).length).toBe(2);
      expect(screen.getAllByTestId(`about__Career${i}--name`).length).toBe(2);
      expect(screen.getAllByTestId(`about__Career${i}--summary`).length).toBe(2);
    });
    certification.map((_, i) => {
      expect(screen.getAllByTestId(`about__Certification${i}`).length).toBe(2);
      expect(screen.getAllByTestId(`about__Certification${i}--date`).length).toBe(2);
      expect(screen.getAllByTestId(`about__Certification${i}--favicon`).length).toBe(2);
      expect(screen.getAllByTestId(`about__Certification${i}--name`).length).toBe(2);
    });
    expect(screen.getByTestId('about__Contact--name')).toBeVisible();
    expect(screen.getByTestId('about__Contact--email')).toBeVisible();
    expect(screen.getByTestId('about__Contact--message')).toBeVisible();
    expect(screen.getByTestId('about__Contact--send')).toBeVisible();
    expect(screen.getByTestId('about__Contact--attention')).toBeVisible();
    expect(screen.getByTestId('about__Contact--privacyPolicy')).toBeVisible();
  });

  it('問い合わせフォームの全ての入力欄に正常値を設定することで送信ボタンが活性化されること', async () => {
    render(<About />);

    expect(screen.getByTestId('about__Contact--send')).not.toBeEnabled();
    userEvent.type(screen.getByTestId('about__Contact--name'), dummy_contactData.name);
    expect((screen.getByTestId('about__Contact--name') as HTMLInputElement).value).toBe(dummy_contactData.name);
    userEvent.type(screen.getByTestId('about__Contact--email'), dummy_contactData.email);
    expect((screen.getByTestId('about__Contact--email') as HTMLInputElement).value).toBe(dummy_contactData.email);
    userEvent.type(screen.getByTestId('about__Contact--message'), dummy_contactData.message);
    expect((screen.getByTestId('about__Contact--message') as HTMLInputElement).value).toBe(dummy_contactData.message);
    await waitFor(() => expect(screen.getByTestId('about__Contact--send')).toBeEnabled());
  });

  it('問い合わせフォームのメールアドレスがフォーマット不正の場合、送信ボタンが活性化されないこと', async () => {
    render(<About />);

    expect(screen.getByTestId('about__Contact--send')).not.toBeEnabled();
    userEvent.type(screen.getByTestId('about__Contact--name'), dummy_contactData.name);
    userEvent.type(screen.getByTestId('about__Contact--email'), 'INVALID_EMAIL_FORMAT');
    userEvent.type(screen.getByTestId('about__Contact--message'), dummy_contactData.name);
    await new Promise((_) => setTimeout(_, 100));
    expect(screen.getByTestId('about__Contact--send')).not.toBeEnabled();
  });

  it('問い合わせフォームで送信ボタンを押下し問い合わせ確認ダイアログが表示されること', async () => {
    render(<About />);

    userEvent.type(screen.getByTestId('about__Contact--name'), dummy_contactData.name);
    userEvent.type(screen.getByTestId('about__Contact--email'), dummy_contactData.email);
    userEvent.type(screen.getByTestId('about__Contact--message'), dummy_contactData.message);
    await new Promise((_) => setTimeout(_, 100));

    expect(screen.getByTestId('mock__ConfirmDialog')).not.toBeVisible();
    userEvent.click(screen.getByTestId('about__Contact--send'));
    expect(screen.getByTestId('mock__ConfirmDialog')).toBeVisible();
  });

  it('問い合わせ確認ダイアログでOKボタンを押下し、問い合わせフォームに入力した内容が送信されること', async () => {
    render(<About />);

    userEvent.type(screen.getByTestId('about__Contact--name'), dummy_contactData.name);
    userEvent.type(screen.getByTestId('about__Contact--email'), dummy_contactData.email);
    userEvent.type(screen.getByTestId('about__Contact--message'), dummy_contactData.message);
    await new Promise((_) => setTimeout(_, 100));
    userEvent.click(screen.getByTestId('about__Contact--send'));

    expect(screen.getByTestId('mock__ConfirmDialog')).toBeVisible();
    userEvent.click(screen.getByTestId('mock__ConfirmDialog--okButton'));

    await waitFor(() => expect(spy_init).toBeCalledWith(process.env.REACT_APP_EMAILJS_USER_ID));
    await waitFor(() =>
      expect(spy_send).toBeCalledWith(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        dummy_contactData
      )
    );
    await waitFor(() => expect(spy_toastSuccess).toBeCalled());
    expect(screen.getByTestId('mock__ConfirmDialog')).not.toBeVisible();
  });

  it('問い合わせ送信時にエラーが発生した場合、エラーがハンドルされること', async () => {
    const err = new Error('TEST_error');
    spy_init.mockImplementation(() => {
      throw err;
    });

    render(<About />);

    userEvent.type(screen.getByTestId('about__Contact--name'), dummy_contactData.name);
    userEvent.type(screen.getByTestId('about__Contact--email'), dummy_contactData.email);
    userEvent.type(screen.getByTestId('about__Contact--message'), dummy_contactData.message);
    await new Promise((_) => setTimeout(_, 100));
    userEvent.click(screen.getByTestId('about__Contact--send'));

    expect(screen.getByTestId('mock__ConfirmDialog')).toBeVisible();
    userEvent.click(screen.getByTestId('mock__ConfirmDialog--okButton'));

    await waitFor(() => expect(spy_handleError).toBeCalledWith(err));
    expect(screen.getByTestId('mock__ConfirmDialog')).not.toBeVisible();
  });

  it('問い合わせ確認ダイアログでキャンセルボタンを押下し、送信が行われないこと', async () => {
    render(<About />);

    userEvent.type(screen.getByTestId('about__Contact--name'), dummy_contactData.name);
    userEvent.type(screen.getByTestId('about__Contact--email'), dummy_contactData.email);
    userEvent.type(screen.getByTestId('about__Contact--message'), dummy_contactData.message);
    await new Promise((_) => setTimeout(_, 100));
    userEvent.click(screen.getByTestId('about__Contact--send'));

    expect(screen.getByTestId('mock__ConfirmDialog')).toBeVisible();
    userEvent.click(screen.getByTestId('mock__ConfirmDialog--cancelButton'));

    await new Promise((_) => setTimeout(_, 100));
    expect(spy_init).not.toBeCalled();
    expect(spy_send).not.toBeCalled();
    expect(screen.getByTestId('mock__ConfirmDialog')).not.toBeVisible();
  });

  it('リンクを押下しプライバシーポリシーが表示されること', () => {
    render(<About />);

    expect(screen.getByTestId('mock__PrivacyPolicyDialog')).not.toBeVisible();
    userEvent.click(screen.getByTestId('about__Contact--privacyPolicy'));
    expect(screen.getByTestId('mock__PrivacyPolicyDialog')).toBeVisible();
    userEvent.click(screen.getByTestId('mock__PrivacyPolicyDialog--closeButton'));
    expect(screen.getByTestId('mock__PrivacyPolicyDialog')).not.toBeVisible();
  });
});
