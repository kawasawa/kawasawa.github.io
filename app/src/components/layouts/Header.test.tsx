import { Box } from '@mui/material';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Header } from '@/components/layouts/Header';
import { meta, sections } from '@/constants';
import * as Config from '@/utils/config';
import { localeCodes, localeNames } from '@/utils/localization';
import * as Localization from '@/utils/localization';

jest.mock('@/utils/localization', () => ({
  ...jest.requireActual('@/utils/localization'),
  changeLocale: jest.fn(),
}));

jest.mock('@/utils/config', () => ({
  ...jest.requireActual('@/utils/config'),
  setConfig: jest.fn(),
}));

describe('Header', () => {
  const spy_setConfig = jest.spyOn(Config, 'setConfig');
  const spy_changeYupLocale = jest.spyOn(Localization, 'changeLocale');

  beforeEach(() => {
    spy_setConfig.mockClear();
    spy_changeYupLocale.mockClear();
  });

  describe('Narrowメニュー', () => {
    test('初期状態のコンポーネントが表示されること', () => {
      render(<Header />);

      expect(screen.getByTestId('Header__NarrowMenu__Title')).toBeVisible();
      expect(screen.getByTestId('Header__NarrowMenu__Title')).toHaveTextContent(meta.title);
      expect(screen.getByTestId('Header__NarrowMenu__Hamburger')).toBeVisible();
      Object.values(sections).map((section) => {
        expect(screen.getByTestId(`Header__NarrowMenu__${section}`)).not.toBeVisible();
        expect(screen.getByTestId(`Header__NarrowMenu__${section}`)).toBeDefined();
        expect(screen.getByTestId(`Header__NarrowMenu__${section}`)).toHaveTextContent(section);
      });
      Object.keys(localeNames).map((locale) => {
        expect(screen.getByTestId(`Header__NarrowMenu__CultureList--${locale}`)).not.toBeVisible();
        expect(screen.getByTestId(`Header__NarrowMenu__CultureList--${locale}`)).toBeDefined();
        expect(screen.getByTestId(`Header__NarrowMenu__CultureList--${locale}`)).toHaveTextContent(localeNames[locale]);
      });
    });

    test('言語選択メニューを押下し言語選択メニューアイテムが表示されること', () => {
      render(<Header />);

      Object.keys(localeNames).map((locale) => {
        expect(screen.getByTestId(`Header__NarrowMenu__CultureList--${locale}`)).not.toBeVisible();
      });

      userEvent.click(screen.getByTestId('Header__NarrowMenu__CultureList'));

      Object.keys(localeNames).map((locale) => {
        expect(screen.getByTestId(`Header__NarrowMenu__CultureList--${locale}`)).toBeVisible();
      });
    });

    test('言語選択メニューアイテムを押下し言語選択メニューが閉じること', () => {
      render(<Header />);

      userEvent.click(screen.getByTestId('Header__NarrowMenu__CultureList'));
      userEvent.click(screen.getByTestId(`Header__NarrowMenu__CultureList--${localeCodes.jaJp}`));

      Object.keys(localeNames).map((locale) => {
        expect(screen.getByTestId(`Header__NarrowMenu__CultureList--${locale}`)).not.toBeVisible();
      });
    });

    test('言語選択メニューアイテムを押下し言語設定が変更されること', async () => {
      render(<Header />);

      userEvent.click(screen.getByTestId('Header__NarrowMenu__CultureList'));
      userEvent.click(screen.getByTestId(`Header__NarrowMenu__CultureList--${localeCodes.jaJp}`));

      await waitFor(() => expect(spy_setConfig).toBeCalled());
      await waitFor(() => expect(spy_changeYupLocale).toBeCalled());
    });

    test('ナビゲーションメニューを押下しナビゲーションメニューアイテムが表示されること', () => {
      render(<Header />);

      Object.values(sections).map((section) => {
        expect(screen.getByTestId(`Header__NarrowMenu__${section}`)).not.toBeVisible();
      });

      userEvent.click(screen.getByTestId('Header__NarrowMenu__Hamburger'));

      Object.values(sections).map((section) => {
        expect(screen.getByTestId(`Header__NarrowMenu__${section}`)).toBeVisible();
      });
    });

    test('ナビゲーションメニューアイテムを押下しナビゲーションメニューが閉じること', () => {
      render(
        <>
          <Header />
          <Box component="section" id={Object.values(sections)[0]} />
        </>
      );

      userEvent.click(screen.getByTestId('Header__NarrowMenu__Hamburger'));
      userEvent.click(screen.getByTestId(`Header__NarrowMenu__${Object.values(sections)[0]}`));

      Object.values(sections).map((section) => {
        expect(screen.getByTestId(`Header__NarrowMenu__${section}`)).not.toBeVisible();
      });
    });

    test('タイトルを押下しページトップ位置までスクロールされること', async () => {
      render(<Header />);

      window.scrollY = 100;
      userEvent.click(screen.getByTestId('Header__NarrowMenu__Title'));
      await waitFor(() => expect(window.screenY).toBe(0));
    });

    test('ナビゲーションメニューアイテムを押下し特定の位置までスクロールされること', async () => {
      const mockScrollTo = jest.fn();
      window.scrollTo = mockScrollTo;

      render(
        <>
          <Header />
          <Box component="section" id={Object.values(sections)[0]} />
        </>
      );
      userEvent.click(screen.getByTestId('Header__NarrowMenu__Hamburger'));

      mockScrollTo.mockClear();
      userEvent.click(screen.getByTestId(`Header__NarrowMenu__${Object.values(sections)[0]}`));
      await waitFor(() => expect(mockScrollTo).toBeCalled());
    });
  });

  describe('Wideメニュー', () => {
    test('初期状態のコンポーネントが表示されること', () => {
      render(<Header />);

      expect(screen.getByTestId('Header__WideMenu__Title')).toBeInTheDocument();
      expect(screen.getByTestId('Header__WideMenu__Title')).toHaveTextContent(meta.title);
      Object.values(sections).map((section) => {
        expect(screen.getByTestId(`Header__WideMenu__${section}`)).toBeInTheDocument();
        expect(screen.getByTestId(`Header__WideMenu__${section}`)).toHaveTextContent(section);
      });
      Object.keys(localeNames).map((locale) => {
        expect(screen.getByTestId(`Header__WideMenu__CultureList--${locale}`)).not.toBeVisible();
        expect(screen.getByTestId(`Header__WideMenu__CultureList--${locale}`)).toBeDefined();
        expect(screen.getByTestId(`Header__WideMenu__CultureList--${locale}`)).toHaveTextContent(localeNames[locale]);
      });
    });

    test('言語選択メニューを押下し言語選択メニューアイテムが表示されること', () => {
      render(<Header />);

      Object.keys(localeNames).map((locale) => {
        expect(screen.getByTestId(`Header__WideMenu__CultureList--${locale}`)).not.toBeVisible();
      });

      userEvent.click(screen.getByTestId('Header__WideMenu__CultureList'));

      Object.keys(localeNames).map((locale) => {
        expect(screen.getByTestId(`Header__WideMenu__CultureList--${locale}`)).toBeVisible();
      });
    });

    test('言語選択メニューアイテムを押下し言語選択メニューが閉じること', () => {
      render(<Header />);

      userEvent.click(screen.getByTestId('Header__WideMenu__CultureList'));
      userEvent.click(screen.getByTestId(`Header__WideMenu__CultureList--${localeCodes.jaJp}`));

      Object.keys(localeNames).map((locale) => {
        expect(screen.getByTestId(`Header__WideMenu__CultureList--${locale}`)).not.toBeVisible();
      });
    });

    test('言語選択メニューアイテムを押下し言語設定が変更されること', async () => {
      render(<Header />);

      userEvent.click(screen.getByTestId('Header__WideMenu__CultureList'));
      userEvent.click(screen.getByTestId(`Header__WideMenu__CultureList--${localeCodes.jaJp}`));

      await waitFor(() => expect(spy_setConfig).toBeCalled());
      await waitFor(() => expect(spy_changeYupLocale).toBeCalled());
    });

    test('タイトルを押下しページトップ位置までスクロールされること', async () => {
      render(<Header />);

      window.scrollY = 100;
      userEvent.click(screen.getByTestId('Header__WideMenu__Title'));
      await waitFor(() => expect(window.screenY).toBe(0));
    });

    test('ナビゲーションメニューアイテムを押下し特定の位置までスクロールされること', async () => {
      const mock_ScrollTo = jest.fn();
      window.scrollTo = mock_ScrollTo;

      render(
        <>
          <Header />
          <Box component="section" id={Object.values(sections)[0]} />
        </>
      );

      mock_ScrollTo.mockClear();
      userEvent.click(screen.getByTestId(`Header__WideMenu__${Object.values(sections)[0]}`));
      await waitFor(() => expect(mock_ScrollTo).toBeCalled());
    });
  });
});
