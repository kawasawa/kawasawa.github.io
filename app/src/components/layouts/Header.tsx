import { Close as CloseIcon, Menu as MenuIcon, Translate as TranslateIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Container,
  Fade,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
} from '@mui/material';
import React from 'react';

import { HideOnScroll } from '@/components/elements';
import { meta, sections } from '@/constants';
import { configKeys, getConfig, setConfig } from '@/utils/config';
import { scrollToElement, scrollToTop } from '@/utils/elements';
import { changeLocale, LocaleCodes, localeCodes, localeNames } from '@/utils/localization';

const CultureMenu = (props: { parent: 'NarrowMenu' | 'WideMenu' }) => {
  const [localeCode, setLocaleCode] = React.useState<LocaleCodes>(
    (getConfig(configKeys.locale) ?? localeCodes.jaJp) as LocaleCodes
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>();
  const onMenuClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget), []);
  const onMenuClose = React.useCallback(() => setAnchorEl(null), []);
  const onSelected = React.useCallback(
    (locale: LocaleCodes) => {
      setLocaleCode(locale);
      changeLocale(locale);
      setConfig(configKeys.locale, locale);
      onMenuClose();
    },
    [setLocaleCode, onMenuClose]
  );

  return (
    <>
      <Tooltip title="Select Language">
        <IconButton onClick={onMenuClick} data-testid={`Header__${props.parent}__CultureList`}>
          <TranslateIcon />
        </IconButton>
      </Tooltip>
      <Menu
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        keepMounted
      >
        {Object.keys(localeNames).map((locale) => (
          <MenuItem
            key={`Header__${props.parent}__CultureList--${locale}`}
            selected={locale === localeCode}
            onClick={() => onSelected(locale as LocaleCodes)}
            data-testid={`Header__${props.parent}__CultureList--${locale}`}
          >
            {localeNames[locale]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const NarrowMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>();

  const onTitleClick = React.useCallback(() => scrollToTop(), []);
  const onMenuClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget), []);
  const onMenuClose = React.useCallback(() => setAnchorEl(null), [setAnchorEl]);

  const display = { xs: 'flex', sm: 'none' };
  return (
    <>
      <Link
        component="button"
        variant="h6"
        color="inherit"
        underline="none"
        sx={{ display, cursor: 'pointer' }}
        onClick={onTitleClick}
        data-testid="Header__NarrowMenu__Title"
      >
        {meta.title}
      </Link>
      <Box sx={{ display, flexGrow: 1 }} />
      <Box sx={{ display, m: 0 }}>
        {/* 言語設定 */}
        <CultureMenu parent="NarrowMenu" />

        {/* ナビゲーション */}
        {/* NOTE: ハンバーガーメニューを実装 (hamburger-react に頼らずに) */}
        <IconButton onClick={onMenuClick} data-testid="Header__NarrowMenu__Hamburger">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 30, height: 30 }}>
            {!anchorEl && (
              <Fade in={!anchorEl} unmountOnExit>
                <MenuIcon />
              </Fade>
            )}
            {!!anchorEl && (
              <Fade in={!!anchorEl} unmountOnExit>
                <CloseIcon />
              </Fade>
            )}
          </Box>
        </IconButton>
        <Menu
          open={Boolean(anchorEl)}
          onClose={onMenuClose}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{ display: { xs: 'block', sm: 'none' } }}
          keepMounted
        >
          {Object.values(sections).map((section) => (
            <MenuItem
              key={`Header__NarrowMenu__${section}`}
              onClick={() => {
                scrollToElement(section, -20);
                onMenuClose();
              }}
              data-testid={`Header__NarrowMenu__${section}`}
            >
              {section}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );
};

const WideMenu = () => {
  const onTitleClick = React.useCallback(() => scrollToTop(), []);

  const display = { xs: 'none', sm: 'flex' };
  return (
    <>
      <Link
        component="button"
        variant="h6"
        color="inherit"
        underline="none"
        sx={{ display, cursor: 'pointer' }}
        onClick={onTitleClick}
        data-testid="Header__WideMenu__Title"
      >
        {meta.title}
      </Link>
      <Box sx={{ display, flexGrow: 1 }} />
      <Box sx={{ display }}>
        {/* 言語設定 */}
        <CultureMenu parent="WideMenu" />

        {/* ナビゲーション */}
        {Object.values(sections).map((section) => (
          <Button
            key={`Header__WideMenu__${section}`}
            onClick={() => scrollToElement(section, -60)}
            sx={{
              margin: '0 8px',
              padding: '8px',
              color: 'common.white',
            }}
            data-testid={`Header__WideMenu__${section}`}
          >
            {section}
          </Button>
        ))}
      </Box>
    </>
  );
};

export const Header = () => (
  <HideOnScroll>
    <AppBar component="header" position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 0 }}>
          <NarrowMenu />
          <WideMenu />
        </Toolbar>
      </Container>
    </AppBar>
  </HideOnScroll>
);
