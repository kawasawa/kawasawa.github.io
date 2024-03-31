import { Translate as TranslateIcon } from '@mui/icons-material';
import { AppBar, Box, Button, Container, IconButton, Link, Menu, MenuItem, Toolbar, Tooltip } from '@mui/material';
import { Turn as Hamburger } from 'hamburger-react';
import React from 'react';
import { animateScroll, Link as ScrollLink } from 'react-scroll';

import { HideOnScroll } from '@/components/controls';
import { meta, sections } from '@/constants';
import { configKeys, getConfig, setConfig } from '@/utils/config';
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

  const onTitleClick = React.useCallback(() => {
    animateScroll.scrollToTop();
  }, []);
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
        <Button sx={{ p: 0, minWidth: 0 }} onClick={onMenuClick} data-testid="Header__NarrowMenu__Hamburger">
          <Hamburger toggled={!!anchorEl} size={24} color="white" />
        </Button>
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
            <ScrollLink
              key={`Header__NarrowMenu__${section}`}
              to={section}
              smooth={true}
              offset={-20}
              onClick={onMenuClose}
              data-testid={`Header__NarrowMenu__${section}`}
            >
              <MenuItem>{section}</MenuItem>
            </ScrollLink>
          ))}
        </Menu>
      </Box>
    </>
  );
};

const WideMenu = () => {
  const onTitleClick = React.useCallback(() => animateScroll.scrollToTop(), []);

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
          <ScrollLink
            key={`Header__WideMenu__${section}`}
            to={section}
            smooth={true}
            offset={-60}
            style={{
              margin: '0 8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'white',
            }}
            data-testid={`Header__WideMenu__${section}`}
          >
            {section}
          </ScrollLink>
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
