import 'react-toastify/dist/ReactToastify.css';

import { colors, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import i18n from 'i18next';
import React from 'react';
import { useEffect } from 'react';
import ga from 'react-ga4';
import { initReactI18next } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import { constants } from './constants';
import jaJson from './locales/ja.json';
import { Top } from './pages';

i18n.use(initReactI18next).init({
  resources: {
    ja: { translation: jaJson },
  },
  lng: 'ja',
  fallbackLng: 'ja',
});

const AppTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: colors.grey[900] },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

const App = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ga.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID!);
    ga.send({ hitType: 'pageview', page: constants.url.self });
  }, []);

  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <Top data-testid="app__Top" />
      <ToastContainer draggable={false} closeButton={false} autoClose={5000} data-testid="app__ToastContainer" />
    </ThemeProvider>
  );
};

export default App;
