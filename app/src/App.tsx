import 'react-toastify/dist/ReactToastify.css';

import { colors, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ga from 'react-ga4';
import { ToastContainer } from 'react-toastify';

import { links } from '@/constants';
import { Top } from '@/pages';

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
  React.useEffect(() => {
    /* istanbul ignore else */
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      ga.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID!);
      ga.send({ hitType: 'pageview', page: links.self });
    }
  }, []);

  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <Top data-testid="App__Top" />
      <ToastContainer draggable={false} closeButton={false} autoClose={5000} data-testid="App__ToastContainer" />
    </ThemeProvider>
  );
};

export default App;
