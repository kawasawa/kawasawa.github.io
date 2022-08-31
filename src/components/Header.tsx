import { AppBar, Box, Button, Container, Link, Menu, MenuItem, Toolbar } from '@mui/material';
import { Turn as Hamburger } from 'hamburger-react';
import React, { useCallback, useState } from 'react';
import { animateScroll, Link as ScrollLink } from 'react-scroll';

import { constants } from '../constants';

const NarrowMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const onTitleClick = useCallback(() => {
    animateScroll.scrollToTop();
  }, []);
  const onMenuClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget), []);
  const onMenuClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);

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
        data-testid="header__narrowMenu--title"
      >
        {constants.meta.title}
      </Link>
      <Box sx={{ display, flexGrow: 1 }} />
      <Box sx={{ display, m: 0 }}>
        <Button sx={{ p: 0, minWidth: 0 }} onClick={onMenuClick} data-testid="header__narrowMenu--hamburger">
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
          {Object.values(constants.sections).map((section) => (
            <ScrollLink
              key={`header__narrowMenu--${section}`}
              to={section}
              smooth={true}
              offset={-20}
              onClick={onMenuClose}
              data-testid={`header__narrowMenu--${section}`}
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
  const onTitleClick = useCallback(() => animateScroll.scrollToTop(), []);

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
        data-testid="header__wideMenu--title"
      >
        {constants.meta.title}
      </Link>
      <Box sx={{ display, flexGrow: 1 }} />
      <Box sx={{ display }}>
        {Object.values(constants.sections).map((section) => (
          <ScrollLink
            key={`header__wideMenu--${section}`}
            to={section}
            smooth={true}
            offset={-60}
            style={{
              margin: '0 8px',
              padding: '8px',
              cursor: 'pointer',
            }}
            data-testid={`header__wideMenu--${section}`}
          >
            {section}
          </ScrollLink>
        ))}
      </Box>
    </>
  );
};

export const Header = () => (
  <AppBar position="fixed">
    <Container maxWidth="xl">
      <Toolbar disableGutters sx={{ minHeight: 0 }}>
        <NarrowMenu />
        <WideMenu />
      </Toolbar>
    </Container>
  </AppBar>
);
