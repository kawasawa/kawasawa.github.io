import { Box } from '@mui/material';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Header } from '@/components/layouts/Header';
import { meta, sections } from '@/constants';

describe('Header', () => {
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
    });

    test('ハンバーガーメニューを押下しメニューアイテムが表示されること', () => {
      render(<Header />);

      Object.values(sections).map((section) => {
        expect(screen.getByTestId(`Header__NarrowMenu__${section}`)).not.toBeVisible();
      });

      userEvent.click(screen.getByTestId('Header__NarrowMenu__Hamburger'));

      Object.values(sections).map((section) => {
        expect(screen.getByTestId(`Header__NarrowMenu__${section}`)).toBeVisible();
      });
    });

    test('メニューアイテムを押下しハンバーガーメニューが閉じること', () => {
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

    test('メニューアイテムを押下し特定の位置までスクロールされること', async () => {
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
    });

    test('タイトルを押下しページトップ位置までスクロールされること', async () => {
      render(<Header />);

      window.scrollY = 100;
      userEvent.click(screen.getByTestId('Header__WideMenu__Title'));
      await waitFor(() => expect(window.screenY).toBe(0));
    });

    test('メニューアイテムを押下し特定の位置までスクロールされること', async () => {
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
