import { Box } from '@mui/material';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { constants } from '../constants';
import { Header } from './Header';

describe('Header', () => {
  describe('Narrowメニュー', () => {
    it('初期状態のコンポーネントが表示されること', () => {
      render(<Header />);

      expect(screen.getByTestId('header__narrowMenu--title')).toBeVisible();
      expect(screen.getByTestId('header__narrowMenu--title')).toHaveTextContent(constants.meta.title);
      expect(screen.getByTestId('header__narrowMenu--hamburger')).toBeVisible();
      Object.values(constants.sections).map((section) => {
        expect(screen.getByTestId(`header__narrowMenu--${section}`)).not.toBeVisible();
        expect(screen.getByTestId(`header__narrowMenu--${section}`)).toBeDefined();
        expect(screen.getByTestId(`header__narrowMenu--${section}`)).toHaveTextContent(section);
      });
    });

    it('ハンバーガーメニューを押下しメニューアイテムが表示されること', () => {
      render(<Header />);

      expect(screen.getByTestId('header__narrowMenu--hamburger').children.item(0)).toHaveAttribute(
        'aria-expanded',
        'false'
      );
      Object.values(constants.sections).map((section) => {
        expect(screen.getByTestId(`header__narrowMenu--${section}`)).not.toBeVisible();
      });

      userEvent.click(screen.getByTestId('header__narrowMenu--hamburger'));

      expect(screen.getByTestId('header__narrowMenu--hamburger').children.item(0)).toHaveAttribute(
        'aria-expanded',
        'true'
      );
      Object.values(constants.sections).map((section) => {
        expect(screen.getByTestId(`header__narrowMenu--${section}`)).toBeVisible();
      });
    });

    it('メニューアイテムを押下しハンバーガーメニューが閉じること', () => {
      render(
        <>
          <Header />
          <Box component="section" id={Object.values(constants.sections)[0]} />
        </>
      );

      userEvent.click(screen.getByTestId('header__narrowMenu--hamburger'));
      userEvent.click(screen.getByTestId(`header__narrowMenu--${Object.values(constants.sections)[0]}`));

      expect(screen.getByTestId('header__narrowMenu--hamburger').children.item(0)).toHaveAttribute(
        'aria-expanded',
        'false'
      );
      Object.values(constants.sections).map((section) => {
        expect(screen.getByTestId(`header__narrowMenu--${section}`)).not.toBeVisible();
      });
    });

    it('タイトルを押下しページトップ位置までスクロールされること', async () => {
      render(<Header />);

      window.scrollY = 100;
      userEvent.click(screen.getByTestId('header__narrowMenu--title'));
      await waitFor(() => expect(window.screenY).toBe(0));
    });

    it('メニューアイテムを押下し特定の位置までスクロールされること', async () => {
      const mockScrollTo = jest.fn();
      window.scrollTo = mockScrollTo;

      render(
        <>
          <Header />
          <Box component="section" id={Object.values(constants.sections)[0]} />
        </>
      );
      userEvent.click(screen.getByTestId('header__narrowMenu--hamburger'));

      mockScrollTo.mockClear();
      userEvent.click(screen.getByTestId(`header__narrowMenu--${Object.values(constants.sections)[0]}`));
      await waitFor(() => expect(mockScrollTo).toBeCalled());
    });
  });

  describe('Wideメニュー', () => {
    it('初期状態のコンポーネントが表示されること', () => {
      render(<Header />);

      expect(screen.getByTestId('header__wideMenu--title')).toBeInTheDocument();
      expect(screen.getByTestId('header__wideMenu--title')).toHaveTextContent(constants.meta.title);
      Object.values(constants.sections).map((section) => {
        expect(screen.getByTestId(`header__wideMenu--${section}`)).toBeInTheDocument();
        expect(screen.getByTestId(`header__wideMenu--${section}`)).toHaveTextContent(section);
      });
    });

    it('タイトルを押下しページトップ位置までスクロールされること', async () => {
      render(<Header />);

      window.scrollY = 100;
      userEvent.click(screen.getByTestId('header__wideMenu--title'));
      await waitFor(() => expect(window.screenY).toBe(0));
    });

    it('メニューアイテムを押下し特定の位置までスクロールされること', async () => {
      const mock_ScrollTo = jest.fn();
      window.scrollTo = mock_ScrollTo;

      render(
        <>
          <Header />
          <Box component="section" id={Object.values(constants.sections)[0]} />
        </>
      );

      mock_ScrollTo.mockClear();
      userEvent.click(screen.getByTestId(`header__wideMenu--${Object.values(constants.sections)[0]}`));
      await waitFor(() => expect(mock_ScrollTo).toBeCalled());
    });
  });
});
